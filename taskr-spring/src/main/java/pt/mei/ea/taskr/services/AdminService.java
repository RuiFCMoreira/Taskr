package pt.mei.ea.taskr.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.config.JwtService;
import pt.mei.ea.taskr.controllers.AdminController;
import pt.mei.ea.taskr.models.Admin;
import pt.mei.ea.taskr.models.Client;
import pt.mei.ea.taskr.repositories.AdminRepository;

import java.util.List;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserService userService;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AdminService(UserService userService, AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public List<Admin> getAllAdmins(){
        return adminRepository.findAllByIsDeletedIsFalse();
    }

    public AdminController.NewAdminResponse addAdmin(AdminController.NewAdminRequest request) throws ResponseStatusException {
        log.info(request.toString());

        userService.checkUniqueUser(request.email(), request.phone());

        Admin admin = new Admin();
        admin.setName(request.name());
        admin.setEmail(request.email());
        admin.setPassword(passwordEncoder.encode(request.password()));
        admin.setPhone(request.phone());
        admin.setBirthDate(request.birthDate());
        adminRepository.save(admin);

        return new AdminController.NewAdminResponse(admin.getId(), "admin", jwtService.generateToken(admin));
    }

    public Admin getAdmin(Long id){
        return adminRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Admin not found"));
    }

    public void editDetails(Long id, AdminController.NewEditDetailsRequest request) {
        Admin a = getAdmin(id);
        if(request.oldPassword() != null && request.newPassword() != null ){
            if(passwordEncoder.matches(request.oldPassword(),a.getPassword())) {
                a.setPassword(passwordEncoder.encode(request.newPassword()));
            } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Old password is not correct");
        }
        if(request.name() != null){
            a.setName(request.name());
        }
        if(request.phone() != null){
            if(adminRepository.existsByPhone(request.phone()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Phone number already exists");
            a.setPhone(request.phone());
        }
        if(request.birthDate() != null){
            a.setBirthDate(request.birthDate());
        }
        adminRepository.save(a);
    }

    public void deleteAdmin(Long id){
        Admin a =  adminRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Admin not found"));
        if (a.getDeleted()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Admin doesn't exist");
        a.delete();
        adminRepository.save(a);
    }
}
