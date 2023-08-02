package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

@Entity
public class ServiceType {


	@Id
	@GeneratedValue
	private Long typeId;
	private String name;
	@Column(columnDefinition = "TEXT")
	private String description;
	private String imageURL;
	@ManyToOne
	@JoinColumn(name = "category_id", nullable = false)
	private ServiceCategory category;

	private Boolean isDeleted = false;


	public ServiceType(ServiceCategory category, String name, String description, String imageURL) {
		this.category = category;
		this.name = name;
		this.description = description;
		this.imageURL = imageURL;
		this.isDeleted = false;
	}

	public ServiceType() {

	}

	public ServiceCategory getCategory() {
		return this.category;
	}

	public void setCategory(ServiceCategory category) {
		this.category = category;
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

	public String getImageURL() {
		return this.imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}


	public Boolean getDeleted() {
		return isDeleted;
	}

	public void setDeleted(Boolean deleted) {
		isDeleted = deleted;
	}

	@Override
	public String toString() {
		return "{" +
			" category='" + getCategory() + "'" +
			", name='" + getName() + "'" +
			", description='" + getDescription() + "'" +
			", imageURL='" + getImageURL() + "'" +
			"}";
	}


	public void setId(Long id) {
		this.typeId = id;
	}

	public Long getId() {
		return typeId;
	}
}