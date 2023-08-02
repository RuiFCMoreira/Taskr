package pt.mei.ea.taskr.models;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
public class Admin extends User {
    public Admin(String name, String email, String password, String phone, Date birthDate) {
        super(name, email, password, phone, birthDate);
    }

    public Admin() {

    }

    public String toString() {
        return "Admin: " + super.toString();
    }
}