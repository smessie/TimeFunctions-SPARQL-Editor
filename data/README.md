# Data

## UGent-Biblio data in Virtuoso SPARQL endpoint

A docker-compose file is provided to run a Virtuoso SPARQL endpoint with the UGent-Biblio data.

First, make sure the data is available in the `data/import/` folder as `publications.nt`. You can download the data from this [Nextcloud folder](https://cloud.ilabt.imec.be/index.php/s/mofLEFe4EwHZ39p).

Next, create a `.env` file next to the `docker-compose.yml` file with the following content:

```env
DBA_PASSWORD=replacei-with-your-secret-virtuoso-password
```

Then, run the following command to start the Virtuoso SPARQL endpoint:

```bash
docker compose up -d -e DBA_PASSWORD=*my-secret-virtuoso-password*
```

This will start the Virtuoso service, load the data using the `scripts/load-data.sql` script and enable CORS using the `scripts/add-cors.sql` script, and expose the SPARQL endpoint at `http://localhost:8890/sparql`.

You can then query the data using the QLever SPARQL endpoint. For example, you can use the following query to retrieve all publications:

```sparql
SELECT ?s ?p ?o
WHERE {
  ?s ?p ?o .
}
LIMIT 100
```

You can access the Virtuoso SPARQL endpoint at `http://localhost:8890/sparql`.
