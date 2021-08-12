const pool=require('./db');
const express=require('express');
const cors=require('cors')
const app=express();
const swaggerJSDoc=require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express');
const {createEmployee,createDepartment,createEmployeeAssignment}=require('./create')
const {getAllEmployees,getAllDepartments,getEmployee,getDepartment}=require('./read')
const {updateEmployee,updateDepartment}=require('./update')
const {deleteEmployee,deleteDepartment,deleteEmployeeAssignment}=require('./delete')
var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "info";


const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Employee Management API',
            version:'1.0.0',
            description:'Employe Api for employee management',
            servers:["http://localhost:3000"]
        }
    },
    apis:["index.js"]
}
const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));


const {}=require('./update');
const { response } = require('express');
var corsOptions={
    origin:'http://example.com',
    optionSuccessStatus:200
}

app.use(express.json());

app.post("/employee", async(req,res)=>{
    try {
        const {name,date_of_joining,designation, gender, email,bio}=req.body;
        const employeeData= await pool.query("INSERT INTO EMPLOYEE(name,date_of_joining,designation,gender,email,bio) VALUES($1,$2,$3,$4,$5,$6) returning *",
                    [name,date_of_joining,designation, gender, email,bio])
        res.json(employeeData.rows[0]);
        logger.info("Employee created successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error(error);
    }
})

app.post("/department", async(req,res)=>{
    try {
        const {name,email,description}=req.body;
        const departmentData= await pool.query("INSERT INTO DEPARTMENT(name,email,description) VALUES($1,$2,$3) returning *",
                    [name,email,description])
        res.json(departmentData.rows[0]);
        logger.info("Department created successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
})

app.post("/employeeassignment", async(req,res)=>{
    try {
        const {employee_id,department_id}=req.body;
        const employeeAssignmentData= await pool.query("INSERT INTO EMPLOYEE_ASSIGNMENT(employee_id,department_id) VALUES($1,$2) returning *",
                    [employee_id,department_id])
        res.json(employeeAssignmentData.rows[0]);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
})

app.get("/employees", async(req,res)=>{
    try {
        const employeeData=await pool.query("SELECT * FROM EMPLOYEE");
        res.json(employeeData.rows);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
})

app.get("/departments", async(req,res)=>{
    try {
        const departmentData=await pool.query("SELECT * FROM DEPARTMENT");
        res.json(departmentData.rows);
        logger.info("Department details fetched successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
})

app.get("/getEmployee", async(req,res)=>{
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
    } catch (error) {
        res.status(500).json(error);
    }
})

app.get("/getDepartment", async(req,res)=>{
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
})

app.get("/updateEmployee", async (req,res)=>{
    try {
        const {id}=req.params;
        const {name,date_of_joining,designation, gender, email,bio}=req.body;
        const employeeData=await pool.query("UPDATE EMPLOYEE SET name=$1, date_of_joining=$2, designation=$3, gender=$4, email=$5, bio=$6 where id= $7 returning *",
            [name,date_of_joining,designation, gender, email,bio,id])
        res.json(employeeData.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.get("/updateDepartment", async (req,res)=>{
    try {
        const {id}=req.params;
        const {name,email,description}=req.body;
        const departmentData=await pool.query("UPDATE DEPARTMENT SET name=$1, email=$2, description=$3 where id= $4 returning *",
            [name,email,description,id])
        res.json(departmentData.rows[0]);
        logger.info("Department updated successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
})

app.get("/deleteEmployee", async (req,res)=>{
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
    } catch (error) {
        res.status(500).json(error);
    }
})

app.get("/deleteDepartment", async (req,res)=>{
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
})

app.get("/deleteEmployeeAssignment", async (req,res)=>{
    try {
        const {employee_id,department_id}=req.params;
        const employeeAssignmentData=await pool.query("DELETE from EMPLOYEE_ASSIGNMENT where department_id=$1 and employee_id=$2 returning *",[department_id,employee_id]);
        res.json(employeeAssignmentData.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
})


/**
 * @swagger
 * definitions:
 *  Employee:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     description: name of the employee
 *     example: 'Amit'
 *    date_of_joining:
 *     type: string
 *     description: date of joining of the employee
 *     example: '2020-08-30'
 *    email:
 *     type: string
 *     description: email of the employee
 *     example: 'testing@example.com'
 *    gender:
 *     type: string
 *     description: gender of the employee
 *     example: 'male'
 *    bio:
 *     type: string
 *     description: biography of the employee
 *     example: 'father, software developer'
 *    designation:
 *     type: string
 *     description: designation of the employee
 *     example: 'Software Engineer'
 *  Department:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     description: name of the department
 *     example: 'javscript'
 *    email:
 *     type: string
 *     description: email of the department
 *     example: 'javascript@whizpath.com'
 *    description:
 *     type: string
 *     description: description of the department
 *     example: 'javascript developers'
 *  Employee_Assignment:
 *   type: object
 *   properties:
 *    employee_id:
 *     type: integer
 *     description: id of the employee
 *     example: 2
 *    department_id:
 *     type: integer
 *     description: id of the department
 *     example: 2
 */


 /**
  * @swagger
  * /employee:
  *  post:
  *   summary: create employee
  *   description: create employee for the organisation
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/Employee'
  *   responses:
  *    200:
  *     description: employee created succesfully
  *    500:
  *     description: failure in creating employee
  */
app.post("/employee", createEmployee);
/**
 * @swagger
 * /department:
 *  post:
 *   summary: create department
 *   description: create department
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the department
 *      schema:
 *       $ref: '#/definitions/Department'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Department'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
app.post("/department", createDepartment);
/**
 * @swagger
 * /employeeassignment:
 *  post:
 *   summary: create employee assignment
 *   description: create employee assignment
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: employee assignment of the department
 *      schema:
 *       $ref: '#/definitions/Employee_Assignment'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Employee_Assignment'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
app.post("/employeeassignment",createEmployeeAssignment);

/**
 * @swagger
 * /employees:
 *  get:
 *   summary: get all employees
 *   description: get all employees
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
app.get('/employees',cors(), getAllEmployees)
/**
 * @swagger
 * /departments:
 *  get:
 *   summary: get all departments
 *   description: get all departments
 *   responses:
 *    200:
 *     description: success
 */
app.get('/departments',cors(), getAllDepartments)
/**
 * @swagger
 * /employee/{employee_id}:
 *  get:
 *   summary: get employee
 *   description: get employee
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */
app.get('/employee/:id',cors(), getEmployee)
/**
 * @swagger
 * /department/{department_id}:
 *  get:
 *   summary: create department
 *   description: create department
 *   parameters:
 *    - in: path
 *      name: department_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */
app.get('/department/:id',cors(), getDepartment)

/**
 * @swagger
 * /employee/{id}:
 *  put:
 *   summary: update employee
 *   description: update employee
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Department'
 */
app.put("/employee/:id",cors(corsOptions),updateEmployee)


/**
 * @swagger
 * /department/{id}:
 *  put:
 *   summary: update department
 *   description: update department
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 2
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/Department'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Department'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Department'
 */
app.put("/department/:id",cors(corsOptions),updateDepartment)

/**
 * @swagger
 * /employee/{employee_id}:
 *  delete:
 *   summary: delete employee
 *   description: delete employee
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */
app.delete("/employee/:id",deleteEmployee)


/**
 * @swagger
 * /department/{department_id}:
 *  delete:
 *   summary: delete department
 *   description: delete department
 *   parameters:
 *    - in: path
 *      name: department_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */
app.delete("/department/:id",deleteDepartment)
/**
 * @swagger
 * /employeeassign/{employee_id}/{department_id}:
 *  delete:
 *   summary: delete employee assignment
 *   description: delete employee assignment
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 12
 *    - in: path
 *      name: department_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 12
 *   responses:
 *    200:
 *     description: success
 */
app.delete("/employeeassign/:employee_id/:department_id",deleteEmployeeAssignment)


app.listen(3000,()=>{
    console.log("server listening in port 3000");
})