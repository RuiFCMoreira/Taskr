package pt.mei.ea.taskr.models;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;



@Entity
@Table(name = "Orders")
public class Order {



	public enum OrderState {
		pending,
		accepted,
		completed,
		rejected,
		paid
	}

	@Id
	@GeneratedValue
	private Long orderId;

	@ManyToOne
	@JoinColumn(name = "provider_id", nullable = false)
	private Provider provider;
	@Column(columnDefinition = "TEXT")
	private String description;
	private LocalDateTime dateHour;

	@ManyToOne
	@JoinColumn(name = "type_id", nullable = false)
	private ServiceType serviceType;
	private Duration duration;
	private BigDecimal pricePerHour;
	private OrderState state;

	@OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private Review review;
	@OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private Address address;
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private Client client;

	public Order(Provider provider, String description, LocalDateTime dateHour, ServiceType serviceType, Duration duration, BigDecimal pricePerHour, Address address, Client client) {
		this.provider = provider;
		this.description = description;
		this.dateHour = dateHour;
		this.serviceType = serviceType;
		this.duration = duration;
		this.pricePerHour = pricePerHour;
		this.state = OrderState.pending;
		this.address = address;
		this.client = client;
	}



	public Order(Provider provider, String description, LocalDateTime dateHour, ServiceType serviceType, Duration duration, BigDecimal pricePerHour, OrderState state, Review review, Address address, Client client) {
		this.provider = provider;
		this.description = description;
		this.dateHour = dateHour;
		this.serviceType = serviceType;
		this.duration = duration;
		this.pricePerHour = pricePerHour;
		this.state = state;
		this.review = review;
		this.address = address;
		this.client = client;
	}

	public Order(Provider provider, String description, LocalDateTime dateHour, ServiceType serviceType, Duration duration,Review review, BigDecimal pricePerHour, OrderState state, Address address, Client client) {
		this.provider = provider;
		this.description = description;
		this.dateHour = dateHour;
		this.serviceType = serviceType;
		this.duration = duration;
		this.pricePerHour = pricePerHour;
		this.state = state;
		this.review = review;
		this.address = address;
		this.client = client;
	}

	public Order() {

	}

	public void setId(Long id) {
		this.orderId = id;
	}

	public Long getId() {
		return orderId;
	}

	public Provider getProvider() {
		return this.provider;
	}

	public void setProvider(Provider provider) {
		this.provider = provider;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getDateHour() {
		return this.dateHour;
	}

	public void setDateHour(LocalDateTime dateHour) {
		this.dateHour = dateHour;
	}

	public ServiceType getServiceType() {
		return this.serviceType;
	}

	public void setServiceType(ServiceType serviceType) {
		this.serviceType = serviceType;
	}

	public Duration getDuration() {
		return this.duration;
	}

	public void setDuration(Duration duration) {
		this.duration = duration;
	}

	public BigDecimal getPricePerHour() {
		return this.pricePerHour;
	}

	public void setPricePerHour(BigDecimal pricePerHour) {
		this.pricePerHour = pricePerHour;
	}

	public OrderState getState() {
		return this.state;
	}

	public void setState(OrderState state) {
		this.state = state;
	}

	public Review getReview() {
		return this.review;
	}

	public void setReview(Review review) {
		this.review = review;
	}

	public Address getAddress() {
		return this.address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public Client getClient() {
		return this.client;
	}

	public void setClient(Client client) {
		this.client = client;
	}



	@Override
	public String toString() {
		return "{" +
			" provider='" + getProvider().getId() + "'" +
			", description='" + getDescription() + "'" +
			", dateHour='" + getDateHour() + "'" +
			", serviceType='" + getServiceType().getName() + "'" +
			", duration='" + getDuration() + "'" +
			", pricePerHour='" + getPricePerHour() + "'" +
			", state='" + getState() + "'" +
			", reviews='" + getReview() + "'" +
			", address='" + getAddress() + "'" +
			", client='" + getClient().getId() + "'" +
			"}";
	}




}