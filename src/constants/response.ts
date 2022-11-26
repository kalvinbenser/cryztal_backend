//Response format for Success and failure
export const Success = {
    Status: true,
    Success: true,
    Message: '',
    data: {},
};

export const Failure = {
    Status: true,
    Success: false,
    Type: '',
    Message: '',
    Error: '',
};

export const ServerFailure = {
    Status: false,
    Success: false,
};
