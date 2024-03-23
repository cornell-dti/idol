// run 'yarn ts-node --transpile-only src/API/slackAPI.ts' once in backend directory

import axios, { AxiosResponse } from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const sendMessage = async (text: string): Promise<AxiosResponse> => {
  const payload = {
    text
  };

  const webhookURL =
    'https://hooks.slack.com/services/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';

  // try {
  const response = await axios.post(webhookURL, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // Handle success
  console.log('Message sent successfully:', response.data);
  return response;
  // } catch (error) {
  //     // Handle error
  //     console.error('Failed to send message to Slack:', error);

  //     if (error.response) {
  //         console.error('Response data:', error.response.data);
  //         console.error('Response status:', error.response.status);
  //         console.error('Response headers:', error.response.headers);
  //     } else if (error.request) {
  //         console.error('No response received:', error.request);
  //     } else {
  //         console.error('Error setting up the request:', error.message);
  //     }

  //     // Propagate the error
  //     throw error;
  // }
};

// Example usage
sendMessage('Hello, Slack!')
  .then((response) => {
    // Handle success
    console.log('Success:', response.data);
  })
  .catch((error) => {
    // Handle error
    console.error('Failed to send message to Slack:', error);
  });
