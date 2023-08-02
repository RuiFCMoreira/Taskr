package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class ServiceCategory {



	@Id
	@GeneratedValue
	private Long id;
	private String name;
	@Column(columnDefinition = "TEXT")
	private String description;

	@OneToMany(mappedBy = "category")
	private List<ServiceType> types;

	public ServiceCategory(String name, String description) {
		this.name = name;
		this.description = description;
	}

	public ServiceCategory() {

	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return "{" +
			" name='" + getName() + "'" +
			", description='" + getDescription() + "'" +
			"}";
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}


	public List<ServiceType> getTypes() {
		return types;
	}

	public void setTypes(List<ServiceType> types) {
		this.types = types;
	}
}