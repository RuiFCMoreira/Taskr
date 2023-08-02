package pt.mei.ea.taskr.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.dto.AdminDTO;
import pt.mei.ea.taskr.models.Admin;
import pt.mei.ea.taskr.services.AdminService;
import pt.mei.ea.taskr.services.UserService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/users/admins")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * @return All admins
     * */
    @GetMapping()
    public List<AdminDTO> getAdmins(){
        return adminService.getAllAdmins().stream().map(AdminDTO::getDTO).toList();
    }

    @GetMapping("{id}")
    public AdminDTO getAdmin(@PathVariable("id") Long id){ return AdminDTO.getDTO(adminService.getAdmin(id));}

    public record NewAdminRequest(
            String name,
            String email,
            String password,
            String phone,
            Date birthDate
    ){}

    public record NewAdminResponse(
            Long id,
            String type,
            String token
    ){}

    @PostMapping()
    public NewAdminResponse addAdmin(@RequestBody NewAdminRequest request) throws ResponseStatusException {
        return adminService.addAdmin(request);
    }

    public record NewEditDetailsRequest(
            String name,
            String newPassword,
            String oldPassword,
            String phone,
            Date birthDate
    ){}

    @PostMapping("{id}/edit")
    public void editDetails(@PathVariable("id") Long id, @RequestBody AdminController.NewEditDetailsRequest request){
        adminService.editDetails(id,request);
    }

    @DeleteMapping("{id}")
    public void deleteAdmin(@PathVariable("id") Long id) {
        adminService.deleteAdmin(id);
    }
}
