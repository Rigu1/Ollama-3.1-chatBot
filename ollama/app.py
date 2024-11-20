from flask import Flask, request, jsonify, render_template
import ollama

app = Flask(__name__)

# 대화 히스토리 저장
chat_history = []
keytopic = ''

# 사전 정보 로드 함수
def load_txt_data_to_history(file_path='./myfile.txt'):
    global keytopic
    history = []
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                if line.split(":")[0] == '대표키워드':
                    keytopic = line.split(":")[1].strip()
                else:
                    history.append({'role': 'system', 'content': line})
    except FileNotFoundError:
        print(f"Error: {file_path} 파일을 찾을 수 없습니다.")
    return history

# myfile.txt 내용을 히스토리에 추가
chat_history.extend(load_txt_data_to_history())

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/keytopic', methods=['GET'])
def get_keytopic():
    return jsonify({'keytopic': keytopic})

@app.route('/chat', methods=['POST'])
def chat():
    global chat_history
    user_message = request.json.get('message').strip()
    
    # 대표 키워드 포함한 사용자 메시지
    user_message = keytopic + '에 대해 응답해줘. ' + user_message
    chat_history.append({'role': 'user', 'content': user_message})
    
    try:
        # Ollama 모델에 메시지 전달
        response = ollama.chat(model='llama3.1', messages=chat_history)
        bot_message = response['message']['content']
        
        # 챗봇 응답을 히스토리에 추가
        chat_history.append({'role': 'assistant', 'content': bot_message})
        
        return jsonify({'message': bot_message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
