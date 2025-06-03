/**
 * Analytics service for chatbot intelligence improvement
 */

export interface ChatAnalytics {
  sessionId: string;
  timestamp: Date;
  userInput: string;
  botResponse: string;
  responseTime: number;
  userSatisfaction?: 'positive' | 'negative' | 'neutral';
  intent: string;
  wasHelpful: boolean;
  errorOccurred: boolean;
}

export interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  averageResponseTime: number;
  topIntents: string[];
  userSatisfactionScore: number;
  completedGoals: string[];
}

class AnalyticsService {
  private analytics: ChatAnalytics[] = [];
  private sessions: Map<string, SessionMetrics> = new Map();
  private currentSessionId: string | null = null;

  /**
   * Start a new chat session
   */
  startSession(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.currentSessionId = sessionId;
    
    const session: SessionMetrics = {
      sessionId,
      startTime: new Date(),
      messageCount: 0,
      averageResponseTime: 0,
      topIntents: [],
      userSatisfactionScore: 0,
      completedGoals: []
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (this.currentSessionId) {
      const session = this.sessions.get(this.currentSessionId);
      if (session) {
        session.endTime = new Date();
        this.updateSessionMetrics(this.currentSessionId);
      }
      this.currentSessionId = null;
    }
  }

  /**
   * Track a chat interaction
   */
  trackInteraction(data: Omit<ChatAnalytics, 'sessionId' | 'timestamp'>): void {
    if (!this.currentSessionId) {
      this.startSession();
    }

    const analytics: ChatAnalytics = {
      ...data,
      sessionId: this.currentSessionId!,
      timestamp: new Date()
    };

    this.analytics.push(analytics);
    this.updateSessionMetrics(this.currentSessionId!);
  }

  /**
   * Update session metrics based on analytics data
   */
  private updateSessionMetrics(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const sessionAnalytics = this.analytics.filter(a => a.sessionId === sessionId);
    
    session.messageCount = sessionAnalytics.length;
    
    if (sessionAnalytics.length > 0) {
      const totalResponseTime = sessionAnalytics.reduce((sum, a) => sum + a.responseTime, 0);
      session.averageResponseTime = totalResponseTime / sessionAnalytics.length;
      
      // Calculate top intents
      const intentCounts = sessionAnalytics.reduce((acc, a) => {
        acc[a.intent] = (acc[a.intent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      session.topIntents = Object.entries(intentCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([intent]) => intent);
      
      // Calculate satisfaction score
      const satisfactionScores = sessionAnalytics
        .filter(a => a.userSatisfaction)
        .map(a => {
          switch (a.userSatisfaction) {
            case 'positive': return 1;
            case 'neutral': return 0.5;
            case 'negative': return 0;
            default: return 0.5;
          }
        });
      
      if (satisfactionScores.length > 0) {
        session.userSatisfactionScore = satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length;
      }
    }
  }

  /**
   * Get analytics for the current session
   */
  getCurrentSessionAnalytics(): ChatAnalytics[] {
    if (!this.currentSessionId) return [];
    return this.analytics.filter(a => a.sessionId === this.currentSessionId);
  }

  /**
   * Get session metrics
   */
  getSessionMetrics(sessionId?: string): SessionMetrics | undefined {
    const id = sessionId || this.currentSessionId;
    return id ? this.sessions.get(id) : undefined;
  }

  /**
   * Get all analytics data
   */
  getAllAnalytics(): ChatAnalytics[] {
    return [...this.analytics];
  }

  /**
   * Get performance insights
   */
  getInsights(): {
    totalSessions: number;
    averageSessionLength: number;
    mostCommonIntents: string[];
    averageSatisfaction: number;
    errorRate: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const totalSessions = sessions.length;
    
    const averageSessionLength = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.messageCount, 0) / sessions.length 
      : 0;
    
    const allIntents = this.analytics.map(a => a.intent);
    const intentCounts = allIntents.reduce((acc, intent) => {
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonIntents = Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([intent]) => intent);
    
    const satisfactionScores = this.analytics
      .filter(a => a.userSatisfaction)
      .map(a => {
        switch (a.userSatisfaction) {
          case 'positive': return 1;
          case 'neutral': return 0.5;
          case 'negative': return 0;
          default: return 0.5;
        }
      });
    
    const averageSatisfaction = satisfactionScores.length > 0
      ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length
      : 0;
    
    const errorRate = this.analytics.length > 0
      ? this.analytics.filter(a => a.errorOccurred).length / this.analytics.length
      : 0;
    
    return {
      totalSessions,
      averageSessionLength,
      mostCommonIntents,
      averageSatisfaction,
      errorRate
    };
  }

  /**
   * Clear all analytics data
   */
  clearData(): void {
    this.analytics = [];
    this.sessions.clear();
    this.currentSessionId = null;
  }

  /**
   * Export analytics data for external analysis
   */
  exportData(): {
    analytics: ChatAnalytics[];
    sessions: SessionMetrics[];
    insights: ReturnType<typeof this.getInsights>;
  } {
    return {
      analytics: this.getAllAnalytics(),
      sessions: Array.from(this.sessions.values()),
      insights: this.getInsights()
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();