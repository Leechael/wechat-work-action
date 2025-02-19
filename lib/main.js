const core = require('@actions/core');
const axios = require('axios');

async function run () {
  try {
    const url = core.getInput('url');
    const urls = url.split(';');
    const type = core.getInput('type');
    const content = core.getInput('content');
    const at = core.getInput('at');

    let payload = {
      msgtype: 'text',
      text: {
        content: content
      },
      mentioned_list : {}
    };

    if(type === "text"){
      if (at !== '') {
        if (at.toLowerCase() === 'all') {
          payload.text.mentioned_list = ["@all"];
        }else{
          payload.text.mentioned_list = at.split(",");
        }
      }
    }

    if (type === 'markdown') {
      payload = {
        msgtype: 'markdown',
        markdown: {
          content: content
        }
      };
    }

    if (type === "custom"){
      payload = JSON.parse(content)
    }

    const result = await Promise.all(urls.map((url) => {
      return axios.post(url, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }));

    console.log('response:', result);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
