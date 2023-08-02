package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

@Entity
public class Municipality {



	@Id
	@GeneratedValue
	private Long id;

	@ManyToOne
	@JoinColumn(name = "district_id")
	private District district;
	private String name;

	public Municipality(District district, String name) {
		this.district = district;
		this.name = name;
	}

	public Municipality() {

	}

	public District getDistrict() {
		return this.district;
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "{" +
			" district='" + getDistrict() + "'" +
			", name='" + getName() + "'" +
			"}";
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

}