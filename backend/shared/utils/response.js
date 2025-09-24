class ApiResponse {
  static success(data = null, message = 'Success', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  static error(message = 'Internal Server Error', statusCode = 500, errors = null) {
    return {
      success: false,
      message,
      errors,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  static paginated(data, pagination, message = 'Success') {
    return {
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit)
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ApiResponse;