import swaggerUi from "swagger-ui-express"; // swagger-ui와 익스프레스를 연결해줌
import swaggerJsDoc from "swagger-jsdoc";
// swagger-ui를 표현해줌
import dotenv from "dotenv";
dotenv.config();

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Resume",
      description: "이력서 API"
    },
    servers: [
      { url: process.env.API_URL }, // 요청 URL
      { url: "http://localhost:3018" } //local 환경 대비
    ],
    paths: {
      "/api/sign-up": {
        post: {
          description: "회원가입 API",
          parameters: [
            {
              name: "body",
              in: "body",
              schema: {
                type: "object",
                properties: {
                  email: {
                    example: "sparta@sparta.com"
                  },
                  password: {
                    example: "qwerty1234"
                  },
                  passwordCheck: {
                    example: "qwerty1234"
                  },
                  userName: {
                    example: "김르탄"
                  }
                }
              }
            }
          ],
          responses: {
            201: {
              description: "Created"
            },
            400: {
              description: "Bad Request"
            },
            409: {
              description: "Conflict"
            }
          }
        }
      },
      "/api/sign-in": {
        post: {
          description: "로그인 API",
          parameters: [
            {
              name: "body",
              in: "body",
              schema: {
                type: "object",
                properties: {
                  email: {
                    example: "sparta@sparta.com"
                  },
                  password: {
                    example: "qwerty1234"
                  }
                }
              }
            }
          ],
          responses: {
            200: {
              description: "OK"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/users": {
        get: {
          description: "내 정보 조회 API",
          responses: {
            200: {
              description: "OK"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/resumes": {
        post: {
          description: "이력서 등록 API",
          parameters: [
            {
              name: "body",
              in: "body",
              schema: {
                type: "object",
                properties: {
                  title: {
                    example: "첫 이력서"
                  },
                  content: {
                    example: "열심히 할 자신 있습니다!"
                  }
                }
              }
            }
          ],
          responses: {
            201: {
              description: "Created"
            },
            400: {
              description: "Bad Request"
            },
            401: {
              description: "Unauthorized"
            }
          }
        },
        get: {
          description: "이력서 조회 API",
          parameters: [
            {
              name: "orderKey",
              in: "query",
              type: "string"
            },
            {
              name: "orderValue",
              in: "query",
              type: "string"
            }
          ],
          responses: {
            200: {
              description: "OK"
            },
            400: {
              description: "Bad Request"
            },
            404: {
              description: "Not Found"
            }
          }
        }
      },
      "/api/resumes/{resumeId}": {
        get: {
          description: "이력서 상세 조회 API",
          parameters: [
            {
              name: "resumeId",
              in: "path",
              required: true,
              type: "string"
            }
          ],
          responses: {
            200: {
              description: "OK"
            },
            404: {
              description: "Not Found"
            }
          }
        },
        patch: {
          description: "이력서 수정 API",
          parameters: [
            {
              name: "resumeId",
              in: "path",
              required: true,
              type: "string"
            },
            {
              name: "body",
              in: "body",
              schema: {
                type: "object",
                properties: {
                  title: {
                    example: "이력서"
                  },
                  content: {
                    example: "자신감이 넘칩니다"
                  },
                  status: {
                    example: "DROP"
                  }
                }
              }
            }
          ],
          responses: {
            200: {
              description: "OK"
            },
            400: {
              description: "Bad Request"
            },
            401: {
              description: "Unauthorized"
            },
            404: {
              description: "Not Found"
            }
          }
        },
        delete: {
          description: "이력서 삭제 API",
          parameters: [
            {
              name: "resumeId",
              in: "path",
              required: true,
              type: "string"
            }
          ],
          responses: {
            200: {
              description: "OK"
            },
            401: {
              description: "Unauthorized"
            },
            404: {
              description: "Not Found"
            }
          }
        }
      }
    }
  },
  apis: ["./routers/resumes.router.js", "./routers/users.router.js"] //Swagger 파일 연동
};
const specs = swaggerJsDoc(options);

export { swaggerUi, specs };
