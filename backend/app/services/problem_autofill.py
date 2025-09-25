import requests
import re
from typing import Optional, Dict, List
import json
from rapidfuzz import fuzz

class ProblemAutoFillService:
    """Service to automatically fetch problem details from LeetCode"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def extract_problem_details(self, problem_name: str) -> Optional[Dict]:
        """
        Extract problem details from LeetCode
        Returns a dictionary with extracted information
        """
        try:
            return self._try_leetcode(problem_name)
        except Exception as e:
            print(f"LeetCode API error: {e}")
            return None
    
    def _try_leetcode(self, problem_name: str) -> Optional[Dict]:
        """Try to fetch problem details from LeetCode"""
        # Clean the problem name for LeetCode search
        clean_name = self._clean_problem_name(problem_name)
        
        # LeetCode API endpoint for problems
        api_url = "https://leetcode.com/api/problems/all/"
        
        try:
            response = requests.get(api_url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                best_match = None
                best_score = 0
                
                # Search for the problem in the list using fuzzy matching
                for problem in data.get('stat_status_pairs', []):
                    stat = problem.get('stat', {})
                    title = stat.get('question__title', '').lower()
                    
                    # Use fuzzy matching to find the best match
                    similarity_score = fuzz.ratio(clean_name, title)
                    
                    # Only consider matches with 85% or higher similarity
                    if similarity_score >= 85 and similarity_score > best_score:
                        best_score = similarity_score
                        best_match = problem
                
                # If we found a good match, return the details
                if best_match and best_score >= 85:
                    stat = best_match.get('stat', {})
                    difficulty_map = {1: 'EASY', 2: 'MEDIUM', 3: 'HARD'}
                    difficulty = difficulty_map.get(best_match.get('difficulty', {}).get('level'), 'MEDIUM')
                    
                    # Get problem slug for URL
                    slug = stat.get('question__title_slug', '')
                    problem_url = f"https://leetcode.com/problems/{slug}/"
                    
                    # Try to get topics/tags
                    topics = self._get_leetcode_topics(slug)
                    
                    return {
                        'name': stat.get('question__title', problem_name),
                        'link': problem_url,
                        'difficulty': difficulty,
                        'topics': topics,
                        'platform': 'LeetCode'
                    }
        except Exception as e:
            print(f"LeetCode API error: {e}")
        
        return None
    
    def _clean_problem_name(self, name: str) -> str:
        """Clean problem name for better matching"""
        # Remove special characters and convert to lowercase
        cleaned = re.sub(r'[^\w\s]', '', name.lower())
        # Remove extra spaces
        cleaned = ' '.join(cleaned.split())
        return cleaned
    
    def _get_leetcode_topics(self, slug: str) -> List[str]:
        """Get topics/tags for a LeetCode problem"""
        try:
            # LeetCode GraphQL endpoint
            url = "https://leetcode.com/graphql"
            query = """
            query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                problemsetQuestionList: questionList(
                    categorySlug: $categorySlug
                    limit: $limit
                    skip: $skip
                    filters: $filters
                ) {
                    questions: data {
                        titleSlug
                        topicTags {
                            name
                        }
                    }
                }
            }
            """
            
            variables = {
                "categorySlug": "",
                "skip": 0,
                "limit": 1,
                "filters": {"searchKeywords": slug}
            }
            
            response = requests.post(url, json={'query': query, 'variables': variables}, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                questions = data.get('data', {}).get('problemsetQuestionList', {}).get('questions', [])
                
                if questions:
                    topic_tags = questions[0].get('topicTags', [])
                    return [tag.get('name', '') for tag in topic_tags[:5]]
        except Exception as e:
            print(f"LeetCode topics error: {e}")
        
        return []

# Create a singleton instance
problem_autofill_service = ProblemAutoFillService()