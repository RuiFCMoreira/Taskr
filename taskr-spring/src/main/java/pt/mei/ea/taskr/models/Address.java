package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

@Entity
public class Address {



	@Id
	@Column(name = "order_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "order_id")
	private Order order;

	private String street;
	private String parish;
	private String municipality;
	private String district;

	public Address(String street, String parish, String municipality, String district) {
		this.street = street;
		this.parish = parish;
		this.municipality = municipality;
		this.district = district;
	}

	public Address() {

	}

	public String getStreet() {
		return this.street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getParish() {
		return this.parish;
	}

	public void setParish(String parish) {
		this.parish = parish;
	}

	public String getMunicipality() {
		return this.municipality;
	}

	public void setMunicipality(String municipality) {
		this.municipality = municipality;
	}

	public String getDistrict() {
		return this.district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	@Override
	public String toString() {
		return "Address{" +
				"id=" + id +
				", order=" + order.getId() +
				", street='" + street + '\'' +
				", parish='" + parish + '\'' +
				", municipality='" + municipality + '\'' +
				", district='" + district + '\'' +
				'}';
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


}