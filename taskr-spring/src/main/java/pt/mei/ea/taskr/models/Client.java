package pt.mei.ea.taskr.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Client extends User {

	@OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
	private List<Order> orders;

	public Client(String name, String email, String password, String phone, Date birthDate) {
		super(name, email, password, phone, birthDate);
		orders = new ArrayList<>();
	}

	public Client(String name, String email, String password, String phone, Date birthDate, List<Order> orders) {
		super(name, email, password, phone, birthDate);
		this.orders = orders;
	}

	public Client() {

	}

	public List<Order> getOrders() {
		return this.orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	@Override
	public String toString() {
		return "Client: " + super.toString() + " Orders: " + orders.toString();
	}


}