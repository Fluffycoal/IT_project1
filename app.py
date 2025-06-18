from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data
items = [
    {"id": 1, "name": "Item One"},
    {"id": 2, "name": "Item Two"}
]

# GET route to fetch data
@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify(items)

# POST route to add data
@app.route('/api/items', methods=['POST'])
def add_item():
    new_item = request.json
    items.append(new_item)
    return jsonify(new_item), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)