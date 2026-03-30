
from joblib import Parallel, delayed

def f():
    return 1

p = Parallel(n_jobs=3, pre_dispatch="sys.exit(0)")

p(delayed(f)() for i in range(10)) # this will cause the system to exit 