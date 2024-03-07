from jinja2 import Environment, FileSystemLoader
import os 

def render_template(data):
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Define the path to the directory containing the template file
    template_directory = os.path.join(current_directory, 'templates')

    # Create a Jinja2 environment and load the template file
    env = Environment(loader=FileSystemLoader(template_directory))
    template = env.get_template('django_jam_app/render_template.html')

    # Render the template with the provided data
    rendered_content = template.render(my_list=data)

    return rendered_content

if __name__ == "__main__":
    # Example list data
    notes = [
        "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
        "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", 
        "C6"
        ]
    # Render the template with the list data
    html_content = render_template(notes)

    # Output the rendered HTML content
    print(html_content)