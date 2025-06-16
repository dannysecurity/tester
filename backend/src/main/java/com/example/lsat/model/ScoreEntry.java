package com.example.lsat.model;

import java.time.LocalDate;

public class ScoreEntry {
    private LocalDate date;
    private int score;

    public ScoreEntry() {}

    public ScoreEntry(LocalDate date, int score) {
        this.date = date;
        this.score = score;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
