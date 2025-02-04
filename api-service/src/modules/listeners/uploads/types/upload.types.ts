export type UploadReplySuccess = {
  status: 'success';
  data: {
    url: string;
  };
};

export type UploadReplyError = {
  status: 'error';
  error: unknown;
};

export type UploadReply = UploadReplySuccess | UploadReplyError;
