package com.volunteer.entity;

public enum UserRole {
    VOLUNTEER("Volunteer"),
    ORGANIZER("Event Organizer"),
    ADMIN("Administrator");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
