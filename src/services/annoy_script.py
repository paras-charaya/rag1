from annoy import AnnoyIndex
import sys
import json

# Function to build the Annoy index
def build_index(vectors, dims):
    t = AnnoyIndex(dims, 'angular')
    for i, vector in enumerate(vectors):
        t.add_item(i, vector)
    t.build(10)  # 10 trees for building the index
    return t

# Function to query the index
def query_index(t, query_vector, n_neighbors):
    return t.get_nns_by_vector(query_vector, n_neighbors)

# Parse arguments and call functions
if __name__ == "__main__":
    command = sys.argv[1]

    if command == "build":
        # Load the vectors passed from Node.js
        vectors = json.loads(sys.argv[2])
        dims = int(sys.argv[3])
        index = build_index(vectors, dims)
        index.save("index.ann")
        print("Index built and saved.")
    
    elif command == "query":
        # Load the index and perform the query
        index = AnnoyIndex(int(sys.argv[2]), 'angular')
        index.load(sys.argv[3])  # Load pre-built index
        query_vector = json.loads(sys.argv[4])
        n_neighbors = int(sys.argv[5])
        neighbors = query_index(index, query_vector, n_neighbors)
        print(json.dumps(neighbors))  # Send results back to Node.js
