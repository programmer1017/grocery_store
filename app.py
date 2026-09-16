from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "grocery_secret_key"  # مفتاح تشفير الجلسات

# قاعدة بيانات مؤقتة للمنتجات (يمكن استبدالها بـ SQLite مستقبلاً)
products = [
    {"id": 1, "name": "حليب طازج 1 لتر", "price": 6.5, "category": "ألبان", "in_stock": True, "image": "https://via.placeholder.com/150"},
    {"id": 2, "name": "خبز توست أبيض", "price": 5.0, "category": "مخبوزات", "in_stock": True, "image": "https://via.placeholder.com/150"},
    {"id": 3, "name": "ماء 330 مل (كرتون)", "price": 18.0, "category": "مشروبات", "in_stock": False, "image": "https://via.placeholder.com/150"}
]

# --- واجهة العميل ---

@app.route('/')
def index():
    cart = session.get('cart', {})
    total_price = sum(item['price'] * item['qty'] for item in cart.values())
    return render_template('index.html', products=products, cart=cart, total_price=total_price)

@app.route('/add_to_cart/<int:product_id>')
def add_to_cart(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if product and product['in_stock']:
        cart = session.get('cart', {})
        p_id = str(product_id)
        if p_id in cart:
            cart[p_id]['qty'] += 1
        else:
            cart[p_id] = {'name': product['name'], 'price': product['price'], 'qty': 1}
        session['cart'] = cart
    return redirect(url_for('index'))

@app.route('/clear_cart')
def clear_cart():
    session.pop('cart', None)
    return redirect(url_for('index'))

# --- لوحة تحكم الأدمن ---

@app.route('/admin')
def admin():
    return render_template('admin.html', products=products)

@app.route('/admin/add', methods=['POST'])
def add_product():
    new_id = len(products) + 1 if products else 1
    name = request.form.get('name')
    price = float(request.form.get('price'))
    category = request.form.get('category')
    image = request.form.get('image') or "https://via.placeholder.com/150"
    
    products.append({
        "id": new_id,
        "name": name,
        "price": price,
        "category": category,
        "in_stock": True,
        "image": image
    })
    return redirect(url_for('admin'))

@app.route('/admin/toggle_stock/<int:product_id>')
def toggle_stock(product_id):
    for product in products:
        if product['id'] == product_id:
            product['in_stock'] = not product['in_stock']
            break
    return redirect(url_for('admin'))

if __name__ == '__main__':
    app.run(debug=True)
