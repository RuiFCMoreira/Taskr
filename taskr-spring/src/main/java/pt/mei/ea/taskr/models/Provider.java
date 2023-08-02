package pt.mei.ea.taskr.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Provider extends User {

	public enum ProviderState {
		pending,
		accepted,
		rejected
	}

	@OneToMany(mappedBy = "provider", fetch = FetchType.LAZY)
	private List<Order> orders;
	@OneToMany(mappedBy = "provider")
	private List<ProviderService> services;
	@OneToMany(mappedBy = "provider")
	private List<ServiceArea> serviceAreas;
	@OneToMany(mappedBy = "provider")
	private List<AvailabilityInterval> calendarAvailability;

	@JsonIgnore
	private String nif;

	private String photoURL;
	private float averageRating = 0;
	private Integer numberOfReviews = 0;
	private ProviderState state = ProviderState.pending;

	private Boolean isDeleted = false;

	public Provider(String name, String email, String password, String phone, Date birthDate, List<Order> orders, List<ProviderService> services, List<ServiceArea> serviceAreas, List<AvailabilityInterval> calendarAvailability, String nif, String photoURL, float averageRating, Integer numberOfReviews, ProviderState state) {
		super(name, email, password, phone, birthDate);
		this.orders = orders;
		this.services = services;
		this.serviceAreas = serviceAreas;
		this.calendarAvailability = calendarAvailability;
		this.nif = nif;
		this.photoURL = photoURL;
		this.averageRating = averageRating;
		this.numberOfReviews = numberOfReviews;
		this.state = state;
		this.isDeleted = false;
	}

	public Provider(String name, String email, String password, String phone, Date birthDate, String nif, String photoURL) {
		super(name, email, password, phone, birthDate);
		this.orders = new ArrayList<>();
		this.services = new ArrayList<>();
		this.serviceAreas = new ArrayList<>();
		this.calendarAvailability = new ArrayList<>();
		this.nif = nif;
		this.photoURL = photoURL;
		this.averageRating = 0;
		this.numberOfReviews = 0;
		this.isDeleted = false;
	}

	public Provider(String name, String email, String password, String phone, Date birthDate, String nif, String photoURL,ProviderState state) {
		super(name, email, password, phone, birthDate);
		this.orders = new ArrayList<>();
		this.services = new ArrayList<>();
		this.serviceAreas = new ArrayList<>();
		this.calendarAvailability = new ArrayList<>();
		this.nif = nif;
		this.photoURL = photoURL;
		this.averageRating = 0;
		this.numberOfReviews = 0;
		this.state = state;
		this.isDeleted = false;
	}

	public Provider() {

	}

	public List<Order> getOrders() {
		return this.orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public List<ProviderService> getServices() {
		return this.services;
	}

	public void setServices(List<ProviderService> services) {
		this.services = services;
	}

	public List<ServiceArea> getServiceAreas() {
		return this.serviceAreas;
	}

	public void setServiceAreas(List<ServiceArea> serviceAreas) {
		this.serviceAreas = serviceAreas;
	}

	public List<AvailabilityInterval> getCalendarAvailability() {
		return this.calendarAvailability;
	}

	public void setCalendarAvailability(List<AvailabilityInterval> calendarAvailability) {
		this.calendarAvailability = calendarAvailability;
	}

	public String getNif() {
		return this.nif;
	}

	public void setNif(String nif) {
		this.nif = nif;
	}

	public String getPhotoURL() {
		return this.photoURL;
	}

	public void setPhotoURL(String photoURL) {
		this.photoURL = photoURL;
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

	public ProviderState getState() {
		return this.state;
	}

	public void setState(ProviderState state) {
		this.state = state;
	}


	public void addRating(Integer rating) {
		float total = numberOfReviews * averageRating;
		this.numberOfReviews += 1;
		this.averageRating = (total + rating) / numberOfReviews;
	}

	@Override
	public String toString() {
		return "{" +
			" orders='" + getOrders() + "'" +
			", services='" + getServices() + "'" +
			", serviceAreas='" + getServiceAreas() + "'" +
			", calendarAvailability='" + getCalendarAvailability() + "'" +
			", nif='" + getNif() + "'" +
			", photoURL='" + getPhotoURL() + "'" +
			", averageRating='" + getAverageRating() + "'" +
			", numberOfReviews='" + getNumberOfReviews() + "'" +
			", state='" + getState() + "'" +
			"}";
	}
@Override
	public void delete(){
		this.setDeleted(true);
		this.setEmail(this.getEmail() + "del" + System.currentTimeMillis());
		this.setPhone(this.getPhone() + "del" + System.currentTimeMillis());
		this.setNif("del" + System.currentTimeMillis());
	}



}