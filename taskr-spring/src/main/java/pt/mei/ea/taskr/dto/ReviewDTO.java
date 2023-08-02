package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Review;

public record ReviewDTO(
        Long id,
        String description,
        Integer rating
){
    public static ReviewDTO getDTO(Review review){
        return new ReviewDTO(review.getId(),
                            review.getDescription(),
                            review.getRating());
    }
}