package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class District {


	@Id
	@GeneratedValue
	private Long id;
	@OneToMany(mappedBy = "district", fetch = FetchType.EAGER) //TODO change back to FetchType.LAZY
	private List<Municipality> municipalities;

	private String name;

	public District(List<Municipality> municipalities, String name) {
		this.municipalities = municipalities;
		this.name = name;
	}


	public District(String name) {
		this.municipalities = new ArrayList<>();
		this.name = name;
	}

	public District() {

	}

	public List<Municipality> getMunicipalities() {
		return this.municipalities;
	}

	public void setMunicipality(List<Municipality> municipalities) {
		this.municipalities = municipalities;
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
			" municipalities='" + getMunicipalities() + "'" +
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