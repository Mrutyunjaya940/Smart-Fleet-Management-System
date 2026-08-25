import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  dataWidget?: any;
}

@Component({
  selector: 'app-ai-copilot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule
  ],
  templateUrl: './ai-copilot.html',
  styleUrls: ['./ai-copilot.css']
})
export class AiCopilot implements OnInit {

  isOpen = false;
  userInput = '';
  isThinking = false;

  messages: ChatMessage[] = [
    {
      sender: 'ai',
      text: 'Hello! I am your AI Fleet Copilot. How can I assist your fleet operations today?',
      timestamp: 'Just now',
      suggestions: [
        '🔍 Run Fleet Anomaly Audit',
        '🌱 Who is the top eco driver?',
        '🔧 Which vehicle needs service?',
        '⛽ Predict next month fuel cost'
      ]
    }
  ];

  ngOnInit(): void {}

  toggleCopilot(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(text?: string): void {
    const msgText = text || this.userInput.trim();
    if (!msgText) return;

    // User Message
    this.messages.push({
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.userInput = '';
    this.isThinking = true;

    // AI Intelligence Response Simulation
    setTimeout(() => {
      this.isThinking = false;
      this.generateAiResponse(msgText);
    }, 1200);
  }

  generateAiResponse(query: string): void {
    const q = query.toLowerCase();
    let replyText = '';
    let suggestions: string[] = [];

    if (q.includes('audit') || q.includes('anomaly') || q.includes('health')) {
      replyText = '🚨 AI Audit Report: 1 Anomaly Detected!\n- Vehicle OD-05-CD-5678 experienced a 12% drop in fuel efficiency (13.4 km/L) and is due for 70k km transmission maintenance.';
      suggestions = ['🔧 Schedule Maintenance', '⚡ View Driver Scorecard'];
    } else if (q.includes('driver') || q.includes('eco') || q.includes('best')) {
      replyText = '🏆 Top Eco Driver: Rahul Kumar (Safety Score: 98/100, Rating: 4.9⭐). He saved 45 Liters of fuel this month through smooth braking!';
      suggestions = ['🏆 Open Leaderboard', '📱 Open Driver Portal'];
    } else if (q.includes('service') || q.includes('maintenance') || q.includes('repair')) {
      replyText = '🔧 Predictive Maintenance Insights:\n- OD-05-CD-5678 (Mahindra Bolero): Immediate Gearbox Service due.\n- OD-02-AB-1234 (Tata Signa): 50,000 km Oil Inspection in 800 km.';
      suggestions = ['📄 Check Document Expiry', '⛽ View Fuel Expenses'];
    } else if (q.includes('fuel') || q.includes('cost') || q.includes('predict') || q.includes('budget')) {
      replyText = '⛽ AI Fuel Budget Forecast:\nEstimated fuel expenditure for next month is ₹52,400 (a 4.2% reduction compared to last month due to TSP route optimization).';
      suggestions = ['🧾 Scan Fuel Receipt (OCR)', 'alt_route Optimize New Route'];
    } else {
      replyText = `I have analyzed your query "${query}". All 4 active vehicles are currently tracked live, with 0 critical route deviations reported.`;
      suggestions = ['🔍 Run Fleet Anomaly Audit', '🌱 Who is the top eco driver?'];
    }

    this.messages.push({
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: suggestions
    });

    this.scrollToBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = document.getElementById('chatContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }
}
