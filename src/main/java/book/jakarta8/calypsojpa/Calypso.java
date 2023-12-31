package book.jakarta8.calypsojpa;
import java.util.List;
import java.util.stream.Collectors;
import javax.ejb.EJB;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import book.jakarta8.calypsojpa.ejb.MemberDAO;
import book.jakarta8.calypsojpa.jpa.Member;
/**
 * REST Web Service
 * http://localhost:8080/calypso-jpa/webapi/member
 */
@Path("/member")
@Produces("application/json")
@Consumes("application/json")
public class Calypso {
    @EJB private MemberDAO members;

    //Get all members in database
    @GET
    @Path("/")
    @Produces("application/json")
    public Response list() {
        List<Member> memberList = members.allMembers();
        StringBuilder outStr = new StringBuilder();
        outStr.append("[");
        outStr.append(memberList.stream().sorted().map((Member itm) ->
                                "{\"firstName\":\"" +
                                        itm.getFirstName() + "\"," +
                                        "\"lastName\":\"" +
                                        itm.getLastName() + "\"," +
                                        "\"birthday\":\"" +
                                        itm.getBirthday() + "\"," +
                                        "\"id\":" + itm.getId() + "}"
                        ).collect(Collectors.joining(",")));
        outStr.append("]");
        return Response.ok().entity(outStr.toString()).build();
    }

    //Get a single member in database
    @GET
    @Path("/{id}")
    @Produces("application/json")
    public Response entity(@PathParam("id") int id) {
        Member m = members.getMember(id);
        return Response.ok().entity(
                "{\"lastName\":\"" +
                        m.getLastName() + "\", " +
                        "\"firstName\":\"" +
                        m.getFirstName() + "\", " +
                        "\"birthday\":\"" +
                        m.getBirthday() + "\", " +
                        "\"id\":" + m.getId() + "}" ).build();
    }

    //Add a new member to database
    @POST
    @Path("/")
    @Produces("application/json")
    public Response post(
            @QueryParam("lastName") String lastName,
            @QueryParam("firstName") String firstName,
            @QueryParam("birthday") String birthday) {
        int newId = members.newMember(lastName, firstName, birthday);
        return Response.ok().entity("{\"id\":"+ newId +"} added successfully").build();
    }

    //Update a member in database
    @PUT
    @Path("/{id}")
    @Produces("application/json")
    public Response put(
            @QueryParam("lastName") String lastName,
            @QueryParam("firstName") String firstName,
            @QueryParam("birthday") String birthday,
            @PathParam("id") int id) {
        members.updateMember(lastName, firstName, birthday, id);
        return Response.ok().entity("{id: "+ id +"} was successfully updated").build();
    }

    //Delete a member in database
    @DELETE
    @Path("/{id}")
    @Produces("application/json")
    public Response del(@PathParam("id") int id) {
        members.deleteMember(id);
        return Response.ok().entity("{id: "+ id +"} was successfully deleted").build();
    }
}