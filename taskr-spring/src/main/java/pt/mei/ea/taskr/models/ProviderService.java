package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Objects;

@Entity
public class ProviderService {



	@EmbeddedId
	private ProviderServiceId id;

	private BigDecimal pricePerHour;
	private Duration expectedDuration;
	@Column(columnDefinition = "TEXT")
	private String description;
	private float averageRating;
	private Integer numberOfReviews;
	private Integer numberOfCompletedTasks;

	@ManyToOne()
	@MapsId("typeId")
	private ServiceType type;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("providerId")
	private Provider provider;

	public ProviderService(BigDecimal pricePerHour, Duration expectedDuration, String description, float averageRating, Integer numberOfReviews, Integer numberOfCompletedTasks, ServiceType type, Provider provider) {
		this.pricePerHour = pricePerHour;
		this.expectedDuration = expectedDuration;
		this.description = description;
		this.averageRating = averageRating;
		this.numberOfReviews = numberOfReviews;
		this.numberOfCompletedTasks = numberOfCompletedTasks;
		this.provider = provider;
		this.type = type;
	}

	public ProviderService(ServiceType type, Provider provider) {
		this.averageRating = 0.0F;
		this.numberOfReviews = 0;
		this.numberOfCompletedTasks = 0;
		this.id = new ProviderServiceId(provider.getId(), type.getId());
		this.provider = provider;
		this.type = type;
	}

	public ProviderService(BigDecimal pricePerHour, Duration expectedDuration, String description, ServiceType type, Provider provider) {
		this.pricePerHour = pricePerHour;
		this.expectedDuration = expectedDuration;
		this.description = description;
		this.averageRating = 0.0F;
		this.numberOfReviews = 0;
		this.numberOfCompletedTasks = 0;
		this.id = new ProviderServiceId(provider.getId(), type.getId());
		this.provider = provider;
		this.type = type;
	}

	public ProviderService() {

	}

	public BigDecimal getPricePerHour() {
		return this.pricePerHour;
	}

	public void setPricePerHour(BigDecimal pricePerHour) {
		this.pricePerHour = pricePerHour;
	}

	public Duration getExpectedDuration() {
		return this.expectedDuration;
	}

	public void setExpectedDuration(Duration expectedDuration) {
		this.expectedDuration = expectedDuration;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public float getAverageRating() {
		return this.averageRating;
	}

	public void setAverageRating(float averageRating) {
		this.averageRating = averageRating;
	}

	public Integer getNumberOfReviews() {
		return this.numberOfReviews;
	}

	public void setNumberOfReviews(Integer numberOfReviews) {
		this.numberOfReviews = numberOfReviews;
	}

	public Integer getNumberOfCompletedTasks() {
		return this.numberOfCompletedTasks;
	}

	public void setNumberOfCompletedTasks(Integer numberOfCompletedTasks) {
		this.numberOfCompletedTasks = numberOfCompletedTasks;
	}

	public ServiceType getServiceType() {
		return this.type;
	}

	public void setServiceType(ServiceType type) {
		this.type = type;
	}

	public Provider getProvider(){
		return this.provider;
	}

	public void setProvider(Provider provider){
		this.provider = provider;
	}

	public void addRating(Integer rating) {
		float total = numberOfReviews * averageRating;
		this.numberOfReviews += 1;
		this.averageRating = (total + rating) / numberOfReviews;
	}

	@Override
	public String toString() {
		return "{" +
			" pricePerHour='" + getPricePerHour() + "'" +
			", expectedDuration='" + getExpectedDuration() + "'" +
			", description='" + getDescription() + "'" +
			", averageRating='" + getAverageRating() + "'" +
			", numberOfReviews='" + getNumberOfReviews() + "'" +
			", numberOfCompletedTasks='" + getNumberOfCompletedTasks() + "'" +
			", serviceType='" + getServiceType() + "'" +
			"}";
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		ProviderService that = (ProviderService) o;
		return Objects.equals(type, that.type) && Objects.equals(provider, that.provider);
	}

	@Override
	public int hashCode() {
		return Objects.hash(type, provider);
	}


}