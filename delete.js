const pool=require('./db');

exports.deleteEmployee=async (req,res)=>{
    try {
        const {id}=req.params;
        let data={};
        const employeeAssignmentData=await pool.query("DELETE from EMPLOYEE_ASSIGNMENT where employee_id=$1 returning *",[id]);
        const employeeData= await pool.query("Delete from employee where id =$1 returning *",[id]);
        data=employeeData.rows[0];
        if(data){
            data.departments=employeeAssignmentData.rows
        }else{
            data={
                info:"No employee to delete"
            }
        }
        res.json(data);
        logger.info("Employee deleted successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}

exports.deleteDepartment=async (req,res)=>{
    try {
        const {id}=req.params;
        let data={};
        const employeeAssignmentData=await pool.query("DELETE from EMPLOYEE_ASSIGNMENT where department_id=$1 returning *",[id]);
        const departmentData= await pool.query("Delete from DEPARTMENT where id =$1 returning *",[id]);
        data=departmentData.rows[0];
        if(data){
            data.employees=employeeAssignmentData.rows
        }else{
            data={
                info:"No department to delete"
            }
        }
        res.json(data);
        logger.info("Department deleted successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}

exports.deleteEmployeeAssignment=async (req,res)=>{
    try {
        const {employee_id,department_id}=req.params;
        const employeeAssignmentData=await pool.query("DELETE from EMPLOYEE_ASSIGNMENT where department_id=$1 and employee_id=$2 returning *",[department_id,employee_id]);
        res.json(employeeAssignmentData.rows[0]);
        logger.info("Employee assignment deleted successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}