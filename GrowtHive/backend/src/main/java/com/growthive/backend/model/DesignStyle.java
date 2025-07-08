
package com.growthive.backend.model;

public enum DesignStyle {
    SCANDINAVIAN("Clean, simple designs with natural materials"),
    MODERN("Sleek lines and minimalist approach"),
    INDUSTRIAL("Raw materials and exposed elements"),
    BOHEMIAN("Colorful, eclectic mix of patterns and textures"),
    TRADITIONAL("Classic, timeless designs with elegant details"),
    COASTAL("Light, airy spaces inspired by the beach"),
    FARMHOUSE("Rustic charm with practical comfort");
    
    private final String description;
    
    DesignStyle(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getPromptDescription() {
        switch(this) {
            case SCANDINAVIAN:
                return "Scandinavian interior design with light wood, minimal decoration, white walls, and natural light";
            case MODERN:
                return "Modern interior design with clean lines, neutral colors, minimalist furniture, and open space";
            case INDUSTRIAL:
                return "Industrial interior design with exposed brick, metal fixtures, concrete floors, and raw materials";
            case BOHEMIAN:
                return "Bohemian interior design with colorful textiles, plants, mixed patterns, and eclectic furniture";
            case TRADITIONAL:
                return "Traditional interior design with classic furniture, rich colors, symmetrical arrangements, and elegant details";
            case COASTAL:
                return "Coastal interior design with light blue and white colors, natural textures, beach-inspired decor, and lots of light";
            case FARMHOUSE:
                return "Farmhouse interior design with rustic furniture, wood accents, neutral colors, and vintage-inspired details";
            default:
                return description;
        }
    }
}
