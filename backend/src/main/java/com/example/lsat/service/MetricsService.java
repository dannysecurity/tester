package com.example.lsat.service;

import com.example.lsat.model.ScoreEntry;

import java.util.List;

public class MetricsService {
    public double average(List<ScoreEntry> scores) {
        return scores.stream().mapToInt(ScoreEntry::getScore).average().orElse(0.0);
    }

    public double stddev(List<ScoreEntry> scores) {
        double avg = average(scores);
        double variance = scores.stream()
                .mapToDouble(s -> Math.pow(s.getScore() - avg, 2))
                .average().orElse(0.0);
        return Math.sqrt(variance);
    }
}
