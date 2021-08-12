const pool=require('./db');

exports.getAllEmployees=async(req,res)=>{
    try {
        const employeeData=await pool.query("SELECT * FROM EMPLOYEE");
        res.json(employeeData.rows);
        logger.info("Employee details fetched successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}

exports.getAllDepartments=async(req,res)=>{
    try {
        const departmentData=await pool.query("SELECT * FROM DEPARTMENT");
        res.json(departmentData.rows);
        logger.info("Department details fetched successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}

exports.getEmployee=async(req,res)=>{
    try {
        const{id}=req.params;
        let data={};
        const employeeData=await pool.query("SELECT * FROM EMPLOYEE WHERE id =$1",[id]);
        const departments = await pool.query("SELECT * FROM DEPARTMENT WHERE ID IN (SELECT department_id  from  EMPLOYEE_ASSIGNMENT where EMPLOYEE_ID=$1)",[id]);
        data=employeeData.rows[0];
        if(data){
            data.departments=departments.rows
        }else{
            data={
                info:"No employee data found for this id"
            }
        }
        res.json(data);
        logger.info("Employee data fetched successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}

exports.getDepartment=async(req,res)=>{
    try {
        const{id}=req.params;
        let data={};
        const departmentData=await pool.query("SELECT * FROM DEPARTMENT WHERE id =$1",[id]);
        const employees = await pool.query("SELECT * FROM EMPLOYEE WHERE ID IN (SELECT employee_id  from  EMPLOYEE_ASSIGNMENT where department_id=$1)",[id]);
        data=departmentData.rows[0];
        if(data){
            data.employees=employees.rows
        }else{
            data={
                info:"No department data found for this id"
            }
        }
        res.json(data);
        logger.info("Department data fetched successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}