import os

if os.path.exists("db.sqlite3"):
    os.remove("db.sqlite3")

os.system("python manage.py makemigrations django_jam_app")
os.system("python manage.py migrate")
os.system("python create_super_user.py")

os.system("python population_script.py")

