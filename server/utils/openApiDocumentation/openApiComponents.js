/**
 * @swagger
 * components:
 *   schemas:
 *     ObjectIds:
 *       type: string
 *       minLength: 1
 *       example: 6061d5627dee5516b3824ade
 *     Functionalities:
 *       type: object
 *       required:
 *         - _id
 *         - application
 *         - task
 *         - code
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectIds'
 *         application:
 *           $ref: '#/components/schemas/Applications'
 *         task:
 *           $ref: '#/components/schemas/Tasks'
 *         code:
 *           $ref: '#/components/schemas/Tasks'
 *         ouputValue:
 *           type: boolean
 *         inputVars:
 *           type: object
 *           required:
 *             - name
 *             - type
 *             - isRequired
 *             - infoText
 *             - index
 *           properties:
 *             name:
 *               type: string
 *               example: visible
 *             type:
 *               type: string
 *               example: Boolean
 *             isRequired:
 *               type: boolean
 *             infoText:
 *               type: string
 *               example: Show window after opening
 *             index:
 *               type: integer
 *               example: 0
 *     Applications:
 *       type: string
 *       example: Excel.Files
 *     Tasks:
 *       type: string
 *       example: Open Workbook
 *     RobotCode:
 *       type: string
 *     RPAAttributes:
 *       type: object
 *       required:
 *         - robotId
 *         - activityId
 *         - rpaApplication
 *         - rpaTask
 *       properties:
 *         robotId:
 *           $ref: '#/components/schemas/RobotIds'
 *         activityId:
 *           $ref: '#/components/schemas/ActivityIds'
 *         rpaApplication:
 *           $ref: '#/components/schemas/Applications'
 *         rpaTask:
 *           $ref: '#/components/schemas/Tasks'
 *     Parameters:
 *       type: object
 *       required:
 *         - activityId
 *         - robotId
 *       properties:
 *         activityId:
 *           $ref: '#/components/schemas/ActivityIds'
 *         robotId:
 *           $ref: '#/components/schemas/RobotIds'
 *         outputValue:
 *           type: string
 *           example: Activity_0n140xq_output
 *         rpaParameters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/singleParameterObjects'
 *     singleParameterObjects:
 *       type: object
 *       required:
 *         - name
 *         - value
 *         - requireUserInput
 *         - type
 *         - isRequired
 *         - infoText
 *         - index
 *       properties:
 *         name:
 *           type: string
 *           example: visible
 *         value:
 *           type: boolean
 *         requireUserInput:
 *           type: boolean
 *         type:
 *           type: string
 *           example: Boolean
 *         isRequired:
 *           type: boolean
 *         infoText:
 *           type: string
 *           example: Show window after opening
 *         index:
 *           type: integer
 *           example: 1
 *     UserAccessObjects:
 *       type: object
 *       required:
 *         - accessLevel
 *         - robotId
 *         - userId
 *       properties:
 *         accessLevel:
 *           type: string
 *           example: ReadWrite
 *         robotId:
 *           $ref: '#/components/schemas/RobotIds'
 *         userId:
 *           $ref: '#/components/schemas/ObjectIds'
 *     RobotNameObjects:
 *       type: object
 *       required:
 *         - newRobotName
 *       properties:
 *         newRobotName:
 *           type: string
 *           minLength: 1
 *           example: Automating emails
 *     RobotIds:
 *       type: integer
 *       example: 606199015d691786a44a608f
 *     EventIds:
 *       type: string
 *       minLength: 1
 *       example: Event_0ay5426
 *     ActivityIds:
 *       type: string
 *       minLength: 1
 *       example: Activity_0ay5427
 *     ElementIds:
 *       type: string
 *       minLength: 1
 *       example: Event_0ay5426 or Activity_0ay5427
 *     RobotNames:
 *       type: string
 *       example: Automate morning emails
 *     RobotElements:
 *       type: object
 *       required:
 *         - predecessorIds
 *         - successorIds
 *         - _id
 *         - type
 *         - name
 *         - id
 *       properties:
 *         predecessorIds:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ElementIds'
 *         successorIds:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ElementIds'
 *         _id:
 *           $ref: '#/components/schemas/ObjectIds'
 *         type:
 *           type: string
 *           example: INSTRUCTION
 *         name:
 *           type: string
 *           example: Fill in current sales projections
 *         id:
 *           $ref: '#/components/schemas/ActivityIds'
 *     Robots:
 *       type: object
 *       required:
 *         - _id
 *         - robotName
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/RobotIds'
 *         starterId:
 *           $ref: '#/components/schemas/EventIds'
 *         robotName:
 *           $ref: '#/components/schemas/RobotNames'
 *         elements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RobotElements'
 */
