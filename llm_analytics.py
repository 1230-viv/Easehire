"""
Simple analytics for LLM performance monitoring
"""
import json
import asyncio
from datetime import datetime
from collections import defaultdict

class LLMAnalytics:
    def __init__(self):
        self.stats = defaultdict(lambda: {
            'calls': 0,
            'successes': 0,
            'failures': 0,
            'avg_response_time': 0,
            'total_response_time': 0
        })
    
    def record_call(self, provider, success, response_time):
        """Record an LLM call for analytics"""
        stats = self.stats[provider]
        stats['calls'] += 1
        stats['total_response_time'] += response_time
        stats['avg_response_time'] = stats['total_response_time'] / stats['calls']
        
        if success:
            stats['successes'] += 1
        else:
            stats['failures'] += 1
    
    def get_stats(self):
        """Get current statistics"""
        return dict(self.stats)
    
    def get_best_provider(self):
        """Get the provider with best success rate and speed"""
        if not self.stats:
            return None
            
        best = None
        best_score = -1
        
        for provider, stats in self.stats.items():
            if stats['calls'] == 0:
                continue
                
            success_rate = stats['successes'] / stats['calls']
            # Score combines success rate and speed (lower time = better)
            speed_score = 1.0 / (stats['avg_response_time'] + 1.0)  # Avoid division by zero
            combined_score = (success_rate * 0.7) + (speed_score * 0.3)
            
            if combined_score > best_score:
                best_score = combined_score
                best = provider
                
        return best
    
    def save_to_file(self, filename="llm_stats.json"):
        """Save statistics to file"""
        with open(filename, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'stats': self.get_stats()
            }, f, indent=2)

# Global analytics instance
analytics = LLMAnalytics()
