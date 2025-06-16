package com.example.lsat.controller;

import com.example.lsat.model.ScoreEntry;
import com.example.lsat.service.MetricsService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class ScoreController {
    private final Map<String, List<ScoreEntry>> userScores = new ConcurrentHashMap<>();
    private final MetricsService metricsService = new MetricsService();

    @PostMapping("/scores")
    public void addScore(@RequestBody ScoreRequest request) {
        userScores.computeIfAbsent(request.getUser(), u -> new ArrayList<>())
                .add(new ScoreEntry(LocalDate.parse(request.getDate()), request.getScore()));
    }

    @GetMapping("/scores/{user}")
    public List<ScoreEntry> getScores(@PathVariable String user) {
        return userScores.getOrDefault(user, List.of());
    }

    @GetMapping("/metrics/{user}")
    public MetricsResponse getMetrics(@PathVariable String user) {
        List<ScoreEntry> scores = userScores.getOrDefault(user, List.of());
        double avg = metricsService.average(scores);
        double stddev = metricsService.stddev(scores);
        int best = scores.stream().mapToInt(ScoreEntry::getScore).max().orElse(0);
        return new MetricsResponse(avg, stddev, best);
    }

    public static class ScoreRequest {
        private String user;
        private String date;
        private int score;
        public String getUser() { return user; }
        public void setUser(String user) { this.user = user; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
    }

    public static class MetricsResponse {
        private double average;
        private double stddev;
        private int best;
        public MetricsResponse(double average, double stddev, int best) {
            this.average = average;
            this.stddev = stddev;
            this.best = best;
        }
        public double getAverage() { return average; }
        public double getStddev() { return stddev; }
        public int getBest() { return best; }
    }
}
