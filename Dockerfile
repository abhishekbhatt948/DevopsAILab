FROM Node:18-slim

RUN useradd -m appuser  

WORKDIR /home/appuser/app

COPY package*.json ./

RUN npm install --omit-dev

COPY . .

RUN chown -R appuser:appuser /home/appuser/app

USER appuser

EXPOSE 3000

CMD [ "Node" , "index.js" ]