
function StudentList({ details }) {

    return (
        <>
            <div>Student details table</div>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>DOB</th>
                        <th>Department</th>
                        <th>Skillset</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail) => (
                        <tr key={detail.id}>
                            <td>{detail.first_name}</td>
                            <td>{detail.last_name}</td>
                            <td>{detail.dob?.split("T1")[0]}</td>
                            <td>{detail.dept}</td>
                            <td>{detail.skillset}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default StudentList;