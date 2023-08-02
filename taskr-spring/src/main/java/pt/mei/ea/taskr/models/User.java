package pt.mei.ea.taskr.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class User implements UserDetails {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@JsonIgnore
	private Long id;
	private String name;
	@Column(unique = true)
	private String email;

	@JsonIgnore
	private String password;
	private String phone;
	private Date birthDate;

	private Boolean isDeleted = false;

	@OneToMany(mappedBy = "user")
	private List<Notification> notifications;

	public User(String name, String email, String password, String phone, Date birthDate) {
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.name = name;
		this.birthDate = birthDate;
		this.notifications = new ArrayList<>();
	}

	public User() {

	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String getPassword() {
		return this.password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getBirthDate() {
		return this.birthDate;
	}

	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}

	public List<Notification> getNotifications(){
		return notifications;
	}

	@Override
	public String toString() {
		return "{" +
				" email='" + getEmail() + "'" +
				", password='" + getPassword() + "'" +
				", phone='" + getPhone() + "'" +
				", name='" + getName() + "'" +
				", birthDate='" + getBirthDate() + "'" +
				"}";
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Override
	public String getUsername() {
		return this.getEmail();
	}

	public Boolean getDeleted() {
		return isDeleted;
	}

	public void setDeleted(Boolean deleted) {
		isDeleted = deleted;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<? extends GrantedAuthority> auths;
		if(this instanceof Admin){
			auths = List.of(new SimpleGrantedAuthority("ROLE_" + UserRole.ADMIN.name()),
					new SimpleGrantedAuthority("ROLE_" + UserRole.CLIENT.name()),
					new SimpleGrantedAuthority("ROLE_" + UserRole.PROVIDER.name()));

		} else if (this instanceof Provider){
			auths = List.of(
					new SimpleGrantedAuthority("ROLE_" + UserRole.PROVIDER.name()), new SimpleGrantedAuthority("ROLE_" + UserRole.CLIENT.name()));
		} else {
			auths = List.of(new SimpleGrantedAuthority("ROLE_" + UserRole.CLIENT.name()));
		}
		System.out.println(auths);
		return auths;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public void delete(){
		this.setDeleted(true);
		this.setEmail(this.getEmail() + "deleted");
		this.setPhone(this.getPhone() + "deleted");
	}

}