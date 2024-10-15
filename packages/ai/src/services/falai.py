import fal_client
import random

def prompt_to_asset(prompt):
    def on_queue_update(update):
        if isinstance(update, fal_client.InProgress):
            for log in update.logs:
                print(log["message"])

    seed = random.randint(0, 2**32 - 1)
    result = fal_client.subscribe(
        "comfy/devniel/flux-to-asset",
        arguments={
            "df_string_replace_Replace_With": prompt,
            "ksampler_seed": seed,
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )

    return result

# For development purposes
if __name__ == "__main__":
    test_prompt = "A tree"
    prompt_to_asset(test_prompt)
