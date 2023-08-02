package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

@Entity
public class Review {

	@Id
	@Column(name = "order_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;
	@Column(columnDefinition = "TEXT")
	private String description;
	private Integer rating;

	public Review(Order order, String description, Integer rating) {
		this.order = order;
		this.description = description;
		this.rating = rating;
	}

	public Review() {

	}



	public Order getOrder() {
		return this.order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getRating() {
		return this.rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	@Override
	public String toString() {
		return "{" +
			" review='" + getId() + "'" +
			", description='" + getDescription() + "'" +
			", rating='" + getRating() + "'" +
			"}";
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}