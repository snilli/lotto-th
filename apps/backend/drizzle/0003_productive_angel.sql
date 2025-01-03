-- Custom SQL migration file, put you code below! --
CREATE OR REPLACE FUNCTION sort_string(input TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Split the input string into characters, sort them, and reassemble
    RETURN (
        SELECT string_agg(char, '' ORDER BY char)
        FROM unnest(string_to_array(input, NULL)) AS char
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sort_jsonb(input JSONB)
RETURNS JSONB AS $$
BEGIN
    -- Transform the JSONB array by sorting characters in each element
    RETURN to_jsonb(array_agg(
            sort_string(element::TEXT)
                             ))
                    FROM jsonb_array_elements_text(input) AS element;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION jsonb_to_text_array(input jsonb)
RETURNS text[] AS $$
BEGIN
    RETURN (
        SELECT array_agg(value::text)
        FROM jsonb_array_elements_text(input) AS value
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION merge_jsonb_to_array(VARIADIC jsonb_array jsonb[])
RETURNS jsonb AS $$
DECLARE
    result jsonb := '[]';
    item jsonb;
BEGIN
    FOREACH item IN ARRAY jsonb_array LOOP
        -- If the item is an array, concatenate it with the result array
        IF jsonb_typeof(item) = 'array' THEN
            result := result || item;
        ELSE
            -- If the item is not an array, add it as a single element to the result array
            result := result || jsonb_build_array(item);
        END IF;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;