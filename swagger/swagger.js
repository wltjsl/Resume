import swaggerUi from "swagger-ui-express"; // swagger-ui와 익스프레스를 연결해줌
import swaggerJsDoc from "swagger-jsdoc"; // swagger-ui를 표현해줌

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Resume",
      description: "이력서 API"
    },
    servers: [
      {
        url: "http://localhost:3018" // 요청 URL
      }
    ]
  },
  apis: ["./routers/resumes.router.js", "./routers/users.router.js"] //Swagger 파일 연동
};
const specs = swaggerJsDoc(options);

export { swaggerUi, specs };
