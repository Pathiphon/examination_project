from pythainlp import word_tokenize,word_vector # ทำการเรียกตัวตัดคำ
model = word_vector.get_model()
from pythainlp.word_vector import * # ทำการเรียก thai2vec
from sklearn.metrics.pairwise import cosine_similarity  # ใช้หาค่าความคล้ายคลึง
import numpy as np


def sentence_vectorizer(ss,dim=300,use_mean=True): 
    s = word_tokenize(ss)
    vec = np.zeros((1,dim))
    for word in s:
        if word in model.index_to_key:
            vec+= model.get_vector(word)
        else: pass
    if use_mean: vec /= len(s)
    return vec
def sentence_similarity(s1,s2):
    return cosine_similarity(sentence_vectorizer(str(s1)),sentence_vectorizer(str(s2)))
print(sentence_similarity("คอมพิวเตอร์คืออุปกรณ์จับต้องได้","คอมพิวเตอร์คืออุปกรณ์จัดต้องไม่ได้"))
