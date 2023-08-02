package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
public class AvailabilityInterval {

	@ManyToOne
	@JoinColumn(name = "provider_id", nullable = false)
	private Provider provider;
	private DayOfWeek day;
	private LocalTime startTime;
	private LocalTime endTime;
	@Id
	@GeneratedValue
	private Long id;


	public AvailabilityInterval() {
	}

	public AvailabilityInterval(Provider provider, DayOfWeek day, LocalTime startTime, LocalTime endTime) {
		this.provider = provider;
		this.day = day;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public Provider getProvider() {
		return this.provider;
	}

	public void setProvider(Provider provider) {
		this.provider = provider;
	}

	public DayOfWeek getDay() {
		return this.day;
	}

	public void setDay(DayOfWeek day) {
		this.day = day;
	}

	public LocalTime getStartTime() {
		return this.startTime;
	}

	public void setStartTime(LocalTime startTime) {
		this.startTime = startTime;
	}

	public LocalTime getEndTime() {
		return this.endTime;
	}

	public void setEndTime(LocalTime endTime) {
		this.endTime = endTime;
	}

	@Override
	public String toString() {
		return "{" +
			" provider='" + getProvider().getId()+ "'" +
			", day='" + getDay() + "'" +
			", startTime='" + getStartTime() + "'" +
			", endTime='" + getEndTime() + "'" +
			"}";
	}


	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}
}