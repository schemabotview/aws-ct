"""A schema change: add a column to the catalog's table; old files lack it."""
import sys

import boto3

name, kind = sys.argv[1:3]
glue = boto3.client("glue")
table = glue.get_table(DatabaseName="shop_lake", Name="order_history")["Table"]
table["StorageDescriptor"]["Columns"].append({"Name": name, "Type": kind})
keep = ("Name", "TableType", "Parameters", "PartitionKeys", "StorageDescriptor")
glue.update_table(DatabaseName="shop_lake",
                  TableInput={k: table[k] for k in keep})
for v in glue.get_table_versions(DatabaseName="shop_lake",
                                 TableName="order_history")["TableVersions"]:
    columns = [c["Name"] for c in v["Table"]["StorageDescriptor"]["Columns"]]
    print(f"version {v['VersionId']}: {len(columns)} columns,"
          f" last {columns[-1]}")
