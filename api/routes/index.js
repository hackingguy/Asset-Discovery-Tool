"use strict"


const Routes = [
]

Routes.init = (app) => {
  if (!app || !app.use) {
    console.error(
      "[Error] Route Initialization Failed: app / app.use is undefined"
    )
    return process.exit(1)
  }

  // Custom Routes
  Routes.forEach((route) => app.use(route.path, route.router))

  // Final Route Pipeline
  app.use("*", (request, response, next) => {
    if (!request.isMatched) {
      const { method, originalUrl } = request
      const message = `Cannot ${method} ${originalUrl}`
      const error = new ResponseBody(404, message)
      response.body = error
    }

    return handleResponse(request, response, next)
  })

  // Route Error Handler
  app.use((error, request, response, next) => {
    if (!error) {
      return process.nextTick(next)
    }

    let { statusCode = 500, message } = error
    let responseBody

    if (error.constructor.name === "ResponseBody") {
      responseBody = error
    } else {
      responseBody = new ResponseBody(statusCode, message, error)
    }

    response.body = responseBody
    return handleResponse(request, response, next)
  })
}

export default Routes