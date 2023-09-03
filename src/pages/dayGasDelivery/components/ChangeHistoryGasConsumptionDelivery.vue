<template>
<div class="day-gas-mask">
  <div class="day-gas-container">
    <div class="top-bag">
      <div class="top-title">
        <div class="top-con">
          <el-form
            class="tab-content"
            :model="planForm"
            ref="planForm"
            status-icon
            :rules="rules"
            label-width="180px"
          >
            <el-row :gutter="0">
              <el-col :lg="8" :xl="5">
                <div class="block">
                  <span class="plan-search-label">日期</span>
                  <el-date-picker
                    v-model="planForm.date"
                    format="yyyy/MM/dd"
                    type="date"
                    :picker-options="pickerOptions0"
                    @change="changePlanForm"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </div>
              </el-col>
              <el-col :lg="8" :xl="5">
                <div class="block">
                  <span class="plan-search-label">供应商</span>
                  <el-cascader
                    :options="listSupplierList"
                    :props="{
                      
                      checkStrictly: true,
                      value: 'linfnr',
                      label: 'linfnrTxt',
                      children: '',
                    }"
                    v-model="planForm.changeOptions"
                    @change="handleChange"
                    collapse-tags
                    ref="cascaderAddr"
                    clearable
                  ></el-cascader>
                </div>
              </el-col>
            </el-row>
            <div class="gas-content">
              <!-- 供应商 -->
              <div class="plan-list">
                <div class="list-com supplier-list" style='margin-top:23px;'>
                  <div
                    class="list-item"
                    v-for="(item, index) in getChangedSupplier"
                    :key="index+'l'"
                  >
                  <div style='position:relative;width:507px;'>
                    <div v-if='index == 0' style="position:absolute;top:-35px;left:18px;color:#2C3E50;font-size:16px;font-weight:bolder;">供应商：</div>
                    <el-form-item :label="item.lifnrTxt || item.linfnrTxt" :label-width="labelWidth(item.lifnrTxt || item.linfnrTxt)">
                      <!-- @oninput="insertyty" -->
                      <!-- oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){return} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}" -->
                      <el-input
                        type="number"
                        maxlength=5
                        oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                        v-model="item.gasNum"
                        placeholder="请输入日交割量"
                        :disabled="true"
                      ></el-input>
                      <span class="custom-unit">万方</span>
                    </el-form-item>
                  </div>
                  <!-- 变更气量 -->
                  <div class="user-con" style='position:relative;'>
                    <div v-if='index === 0' style='position:absolute;top:-35px;left:23px;color:#2C3E50;font-size:16px;font-weight:bolder;'>变更气量：</div>
                      <el-form-item label-width="20px">
                        <el-input
                          type="number"
                          oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          placeholder="请输入变更气量"
                          v-model="item.changeGasNum"
                        ></el-input>
                        <div class="custom-tooltip">
                          <!-- <i class="el-icon-warning-outline"></i> -->
                          <!-- <div class="tooltip">
                            已确认
                            <div class="popper__arrow"></div>
                          </div> -->
                        </div>
                        <span class="custom-unit">万方</span>
                      </el-form-item>
                  </div>
                  <!-- 变更原因 -->
                  <div class="user-con-change-reason" style='position:relative;width:500px;'>
                      <div v-if='index == 0' style="position:absolute;top:-35px;left:20px;color:#2C3E50;font-size:16px;font-weight:bolder;">变更原因：</div>
                      <el-form-item label-width="20px">
                        <el-input
                          oninput="if(value>255){value=value.slice(0,value.length-1)} "
                          placeholder="请输入变更原因"
                          v-model="item.msg"
                        ></el-input>
                      </el-form-item>
                  </div>                        
                  </div>
                </div>
              </div>
              <!-- 用气客户 -->
              <div class="plan-list" style='margin-top:22px;'>
                <!-- <div class="plan-list-title">用气客户---------------------------：</div> -->
                <div class="list-com supplier-list user-list">
                  <div
                    class="list-item"
                    v-for="(item, index) in planDataChange"
                    :key="index+'m'"
                  >
                  <!-- 用气客户名称 -->
                  <div class="user-title" style='position:relative;' :style='"min-width:"+labelWidth(item.compCodeTxt)'>
                    <div v-if='index == 0' style="position:absolute;top:-35px;left:2px;color:#2C3E50;font-size:16px;font-weight:bolder;">用气客户：</div>          
                    <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.compCodeTxt}}</div>       
                  </div>
                  <!-- 分输站（一个用气客户对应一个或多个分输站） -->
                  <div class="user-con">
                    <div v-for="(item1,index1) in item.dataInfo" :key="index1+'.'">
                      <el-form-item :label="item1.downGasPlace" label-width="160px">
                        <span class="insert-split">|</span>
                          <i class="el-icon-location"></i>
                        <el-input
                          type="number"
                          oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          v-model="item1.gasNum"
                          placeholder="请输入日交割量"
                          :disabled="true"
                        ></el-input>
                        <div class="custom-tooltip" v-show="item1.status == 1">
                          <!-- <i class="el-icon-warning-outline"></i> -->
                          <div class="tooltip">
                            已确认
                            <div class="popper__arrow"></div>
                          </div>
                        </div>
                        <span class="custom-unit">万方</span>
                      </el-form-item>
                    </div> 
                  </div>
                  <!-- 变更气量 -->
                  <div class="user-con" style='position:relative;'>
                    <div v-if='index === 0' style='position:absolute;top:-35px;left:20px;color:#2C3E50;font-size:16px;font-weight:bolder;'>变更气量：</div>
                    <div v-for="(item1,index1) in item.dataInfo" :key="index1+'.'">
                      <el-form-item label-width="20px">
                        <el-input
                          type="number"
                          oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                          v-model="item1.changeGasNum"
                          placeholder="请输入变更气量"
                        ></el-input>
                        <!-- <div class="custom-tooltip" v-show="item1.status == 1"> -->
                          <!-- <i class="el-icon-warning-outline"></i> -->
                          <!-- <div class="tooltip"> -->
                            <!-- 已确认 -->
                            <!-- <div class="popper__arrow"></div> -->
                          <!-- </div> -->
                        <!-- </div> -->
                        <span class="custom-unit">万方</span>
                      </el-form-item>
                    </div> 
                  </div>
                  <!-- 变更原因 -->
                  <div class="user-con-change-reason" style='position:relative;'>
                    <div v-if='index === 0' style='position:absolute;top:-35px;left:20px;color:#2C3E50;font-size:16px;font-weight:bolder;'>变更原因：</div>
                    <div v-for="(item1,index1) in item.dataInfo" :key="index1+'.'">
                      <el-form-item label-width="20px">
                        <el-input
                          oninput="if(value>255){value=value.slice(0,value.length-1)} "
                          v-model="item1.msg"
                          placeholder="请输入变更原因"
                        ></el-input>
                      </el-form-item>
                    </div> 
                  </div>                  
                  </div>
                </div>
              </div>
              <div class="planSubmit">
                <el-button class="submitBtn" type="primary" @click="planCommit"
                  >提交</el-button
                >
                <el-button class="resetBtn" @click="resetBtn">重置</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 设置价格弹框 -->
    <el-dialog title="价格设置" :visible.sync="dialogFormVisible"  @close="closeSupper">
      <div class="set-price">
        <div class="title">供应商：</div>
        <div class="list-com price-list">
          <div
            class="list-item"
            v-for="(item, index) in getSuppliersList"
            :key="index+'j'"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
            @click="saveLinfrsStatus(item, index)"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label >{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="setGPrice(item)">设置</span>
          </div>
        </div>
        <div class="title">管输方：</div>
        <div class="list-com price-list">
          <div
            class="list-item pipe-tooltip"
            v-for="(item, index) in getPipelinesList"
            :key="index +'w'"
            @click="savePipelineStatus(item, index)"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label >{{ item.name }}</label>
              <!-- 判断是否为虚拟 -->
              <span class="virtual" v-if="item.pipelineType === 2"  @mouseenter="pipTipContentShowB(item,index)" @mouseleave="pipTipContentHideB(item,index)">虚拟
                  <i class="el-icon-question"></i>
              </span>
            </div>
            <div class="tooltip"  :class="{'tip-content-show':item.pipTipContentShow}">
                          虚拟管输方参与对应供应商的采购成本计算，不展示在日报表及结算单中。
                <div class="popper__arrow"></div>
            </div>
            <span class="set-btn" @click.stop="GSetGPrice(item)">设置</span>
          </div>
        </div>
        <div class="title">用气客户：</div>
        <div class="list-com price-list">
          <div
            class="list-item"
            v-for="(item, index) in getCompVosList"
            :key="index+'h'"
            @click="saveCompStatus(item, index)"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label >{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="userSetGPrice(item)">设置</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
    <!-- 供应商设置 -->
    <el-dialog
      title="价格设置  /  供应商设置"
      @close="dialogFormVisible1 = false"
      :visible.sync="dialogFormVisible1"
      :key="editTimer"
    >
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getGPriceItem.name }}</span>
            <span class="com-code">编号：{{ getGPriceItem.code }}</span>
          </div>
          <el-button type="info" class="submitBtn" plain @click="lifnrsExport"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClickGYS"
            class="custom-tab"
          >
          
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
                <div
                  class="content-item"
                  v-for="(item1, index) in getGPriceItemData"
                  :key="index +'g'"
                >
                  <el-form-item label="计价方式：" label-width="100px">
                    <el-radio-group v-model="item1.priceType">
                      <el-radio label="1">单一计价</el-radio>
                      <el-radio label="2">阶梯计价</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="item1.priceType == 1">
                    <el-form-item label="价格：" class="price-custom">
                      <el-input type="number" v-model="item1.gasPrice"></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item2, index1) in item1.priceDesc"
                      :key="index1 +'er'"
                      class="step-input"
                    >
                      <el-row>
                        <el-col :span="11">
                          <el-form-item :label="'阶梯' + (index1 + 1) + '：'" prop="num">
                            <el-input
                              :disabled="item2.num === '超量'"
                              v-model="item2.num"
                              :type="item2.num == '超量'?text:number"
                            ></el-input>
                            <span class="custom-label">气量</span>
                            <span class="custom-unit">万方</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            label=""
                            label-width="20px"
                            :rules="[
                              {
                                required: true,
                                message: '请输入阶梯单价',
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input type="number" v-model="item2.price"></el-input>
                            <span class="custom-label">单价</span>
                            <span class="custom-unit">元/方</span>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="2"
                          v-show="item1.priceDesc.length - 2 === index1"
                        >
                          <span class="del-step" @click="delStep(index1, item2)"
                            >X</span
                          >
                        </el-col>
                      </el-row>
                    </div>

                    <!-- </el-form> -->
                    <el-button
                      class="add-step"
                      type="primary"
                      @click="addBtnClickedgsf(item1)"
                      >添加阶梯</el-button
                    >
                  </template>
                  <el-form-item label="生效时间" class="date-picker-change">
                    <el-date-picker
                      v-model="item1.shoArr"
                      :picker-options="pickerSpaceOptions"
                      format="yyyy/MM/dd"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="del-price-btn" @click="delPriceB(item1,index)">删除</div>
                </div>
              <div class="addprice-btn" @click="addPriceTimePhas">
               添加时间阶段
              </div>
                <!-- <el-form-item> -->
                <div class="com-btn">
                  <el-button @click="gysBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="nextBtnClicked('ruleForm')"
                    >保存</el-button
                  >
                </div>
                <!-- </el-form-item> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：">
                    <el-input
                    type="number"
                      v-model="setSupplierPriceyD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：" prop="date1">
                    <el-date-picker
                      v-model="setSupplierPriceyD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changeCompForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="gysBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setSupplierPricey('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 用气客户设置 -->
    <el-dialog
      title="价格设置  /  用气客户设置"
      :visible.sync="dialogFormVisible2"
      :key="editTimerUser"
    >
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getuserchangeData.name }}</span>
            <span class="com-code">编号：{{ getuserchangeData.code }}</span>
          </div>
          <el-button
            type="info"
            class="submitBtn"
            plain
            @click="compsExportPrice"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content">
          <el-tabs
            v-model="activeNameUser"
            @tab-click="handleClickkh"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
                <div
                  class="content-item"
                  v-for="(item1, index) in getlistCompPriceData"
                  :key="index +'rt'"
                >
                  <el-form-item label="计价方式：" label-width="100px">
                    <el-radio-group v-model="item1.priceType">
                      <el-radio label="1">单一计价</el-radio>
                      <el-radio label="2">阶梯计价</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="item1.priceType == 1" class="">
                    <el-form-item label="价格：" class="price-custom">
                      <el-input type="number" v-model="item1.gasPrice"></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item2, index1) in item1.priceDesc"
                      :key="index1 +'f'"
                      class="step-input"
                    >
                      <el-row>
                        <el-col :span="11">
                          <el-form-item :label="'阶梯' + (index1 + 1) + '：'">
                            <el-input
                              :disabled="item2.num === '超量'"
                              v-model="item2.num"
                              :type="item2.num == '超量'?text:number"
                            ></el-input>
                            <span class="custom-label">气量</span>
                            <span class="custom-unit">万方</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            label=""
                            label-width="20px"
                            :rules="[
                              {
                                required: true,
                                message: '请输入阶梯单价',
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input type="number" v-model="item2.price"></el-input>
                            <span class="custom-label">单价</span>
                            <span class="custom-unit">元/方</span>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="2"
                          v-show="item1.priceDesc.length - 2 === index1"
                        >
                          <span
                            class="del-step"
                            @click="delStepUser(index1, item2)"
                            >X</span
                          >
                        </el-col>
                      </el-row>
                    </div>
                    <el-button
                      class="add-step"
                      type="primary"
                      @click="addBtnClickeduser(item1)"
                      >添加阶梯</el-button
                    >
                  </template>
                  <el-form-item label="生效时间" class="date-picker-change">
                    <el-date-picker
                    format="yyyy/MM/dd"
                      v-model="item1.shoArr"
                      :picker-options="pickerSpaceOptions"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="date-picker"
                      
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="del-price-btn" @click="delPriceUser(item1,index)">删除</div>
                </div>
                
                <div class="addprice-btn" @click="addPriceTimePhasUser">
               添加时间阶段
              </div>
                <div class="com-btn">
                  <el-button @click="userBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="saveCompPrice('ruleForm')"
                    >保存</el-button
                  >
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：" prop="name">
                    <el-input type="number" v-model="setCompPriceYD.prepaidPrice"></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：" prop="date1">
                    <el-date-picker
                      v-model="setCompPriceYD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changeUserForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="userBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setCompPriceY('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 管输方 -->
    <el-dialog title="价格设置  /  管输方" :visible.sync="dialogFormVisible3">
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getGSFitem.name }}</span>
            <span class="com-code">编号：{{ getGSFitem.code }}</span>
          </div>
          
        </div>
        <div class="detail-content loser-detail">
          <el-tabs
            v-model="activeNameGSF"
            @tab-click="handleClickGSF"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
                <div
                  class="loser-top"
                  
                >
                  上载点：{{ getPipelineUpGasPlace}}
                </div>
                <div
                  class="loser-list"
                  v-for="(item, index) in getlistPipelinePriceData"
                  :key="index+'q'"
                >
                  <div class="list-top">
                    <div class="list-top-com">
                      下载点：{{ item.downGasPlace }}
                      <div class="custom-tooltip">
                        <i class="el-icon-warning-outline"></i>
                        <!-- <div class="tooltip">
                          提示语
                          <div class="popper__arrow"></div>
                        </div> -->
                      </div>
                    </div>
                    <div class="list-top-com">客户：{{ item.compCodeTxt }}</div>
                  </div>
                  <el-form-item label="管输价格：">
                    <el-input type="number" v-model="item.gasPrice"></el-input>
                    <span class="custom-unit">元/方</span>
                  </el-form-item>
                </div>
                <div class="com-btn">
                  <el-button @click="gsfBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="savePipelinePrice('ruleForm')"
                    >保存</el-button
                  >
                </div>
                <!-- </el-form-item> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="pipIsShow" label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form1" :model="form1" :rules="form1" label-width="100px">
                  <el-form-item label="预付费用：">
                    <el-input
                      type="number"
                      v-model="setPipelinePriceYD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：">
                    <el-date-picker
                      v-model="setPipelinePriceYD.time"
                      type="date"
                      placeholder="选择日期"
                       @change="changePipelineForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="comBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setPipelinePriceY('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
     <!-- 删除弹框确认 -->
    <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="30%"
        class="tip-dialog"
        >
        <span class="dialog-con">
          {{tipMessage[setTypeTip]}}
            <!-- {{delData.codeTxt?delData.codeTxt:''}} -->
            </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogConsole">取消</el-button>
            <el-button type="primary" @click="dialogVisibleConfirm">确认</el-button>
        </span>
        </el-dialog>
  </div>
</div>
  
</template>

<script>
import api from "/src/http/api";
import topMenu from "/src/components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    topMenu,
  },
  props: {},
  data() {
    return {
      dialogVisible:false,
      setStatus:null,
      setStatusIndex:0,
      tipMessage:{
        'gysT':'启用后，该供应商将参与用气交割及费用计算',
        'gysF':'停用后，该供应商将不参与用气交割及费用计算',
        'userF':'停用后，该用气客户将不参与用气上报、用气交割及费用计算',
        'userT':'启用后，该用气客户将参与用气上报、用气交割及费用计算',
        'pipeT':'启用后，该管输方将参与相关费用计算',
        'pipeF':'停用后，该管输方将不参与相关费用计算'
      },
      setType:'',
      setTypeTip:'',
      pipIsShow:false,//虚拟管输是否显示预付费用
      pipTipContentShow:'',//虚拟管输方提示
      reportChangeOptions:'',
      downloadPoint:[
           
      ],
      editTimer: 3, //编辑弹框key
      editTimerUser:2,
      getuserchangeData: "", //获取用气客户当前选项
      arr: [
        { code: "XA037", name: "蚌埠新奥", status: "01" },
        { code: "XA037", name: "蚌埠新奥2", status: "02" },
      ],
      planUserdata: [], //日期量计划获取用户客户
      planUserdata1:[
    {
        "id":184949,
        "compCode":"XA037",
        "compCodeTxt":"蚌埠新奥",
        pipe:[
         {
             pipeCode:'01',
             pipecodeTex:'永清分输站'
         },{
             pipeCode:'02',
             pipecodeTex:'采四配气站'
         },
        ],
        "gasNum":"12",
        "type":"1",
        "status":0
    },
    {
        "id":184950,
        "compCode":"XA040",
        "compCodeTxt":"滁州新奥",
        pipe:[
         {
             pipeCode:'01',
             pipecodeTex:'永清分输站'
         },{
             pipeCode:'02',
             pipecodeTex:'采四配气站'
         },{
             pipeCode:'02',
             pipecodeTex:'采四配气站'
         }
        ],
        "gasNum":"0",
        "type":"1",
        "status":0
    },
    {
        "id":184951,
        "compCode":"XA052",
        "compCodeTxt":"淮安新奥",
         pipe:[
         {
             pipeCode:'01',
             pipecodeTex:'永清分输站'
         },{
             pipeCode:'02',
             pipecodeTex:'采四配气站'
         },
        ],
        "gasNum":"0",
        "type":"1",
        "status":0
    }
],


      getCompVosList: [], //A获取供应商数据
      getSuppliersList: [], //获取用气客户数据
      getPipelinesList: [], //获取管输方数据
      tipcontent: "地址定位",
      value1: "",
      input: "",
      dialogFormVisible: false, //设置价格弹框显示
      dialogFormVisible1: false, //供应商弹框显示
      dialogFormVisible2: false, //用气客户弹框显示
      dialogFormVisible3: false, //管输方弹框显示
      activeNameGSF: "first", //g管输方tab
      activeName: "first", //供应商tab
      activeNameUser: "first", //用气客户tab
      listSupplierList: [],
      getChangedSupplier: [], //已选择的供应商
      getArr: [], //已获取供应商编码
      getEntysList: [], //获取供应商客户等信息
      isChecked: true,
      gasReportDate: [], //日报表日期
      planForm: {
        date: "",
        changeOptions: "",
      },
      reportTypeM:'',
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
      },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
        arrData: [],
      },

      rules: {
        date1: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        name: [{ required: true, message: "请输入年龄", trigger: "blur" }],
      },
      changeOptions: [],
      repotTypeOptions: [
        {
          value: "01",
          label: "费用",
        },
        {
          value: "02",
          label: "价格",
        },
        {
          value: "03",
          label: "气量",
        },
      ],
      tipContentShow:false,
      options: [],
      startTime: "",
      gasReportStart: "",
      gasReportEnd: "",
      radio: false,
      activedIndex: "1",
      tagsConfig: [],
      flag: true,
      comOptions: "",
      // curComCode: "", //获取公司code
      gasPriceRportchange: "", //获取日报表查询选择的供应商
      getGPriceItem: "", //要设置价格的供应商
      getGSFitem: "", //要设置价格的管输
      getGPriceItemData: [], //获取供应商
      getlistCompPriceData: [], //获取公司数据
      getlistPipelinePriceData: [], //获取管输价格
      pickerSpaceOptions: {
        disabledDate(time) {
          let now = new Date();
          let nowMonth = now.getMonth(); //当前月
          let nowYear = now.getFullYear(); //当前年
          //本月的开始时间
          let monthStartDate = new Date(nowYear, nowMonth, 1);
          //本月的结束时间
          let monthEndDate = new Date(nowYear, nowMonth + 1, 0);

          return (
            time.getTime() < monthStartDate || time.getTime() > monthEndDate
          );
        },
      },
     PminDate: null,
     PmaxDate: null,
     day30: 30 * 24 * 3600 * 1000,
     // 日期使用
     pickerOptions: {
        onPick: ({  minDate }) => {
         if (minDate && this.PminDate) {
           this.PminDate = null;
         } else if (minDate) {
           this.PminDate = minDate.getTime();
         }
       },
       disabledDate: (time) => {
         if (this.PminDate) {
           return (time.getTime() > (this.PminDate + this.day30)) || (time.getTime() < (this.PminDate - this.day30));
         }
         return false;
       }
     },
     pickerOptions0: { 
         disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
         }
    },
      tipPriceData: [], //余额提醒数据
      compPriceListData: "", //公司预付费用列表数据
      supplierPriceListData: "", //供应商预付费用列表数据
      pipelinePriceListData: "", //管输预付费用列表数据
      // 设置供应商预付费用
      setSupplierPriceyD: {
        prepaidPrice: "",
        time: "",
      },
      // 公司预付费用设置
      setCompPriceYD: {
        prepaidPrice: "",
        time: "",
      },
      setPipelinePriceYD: {
        prepaidPrice: "",
        time: "",
      },
      getPriceReportData: "", //价格日报表数据
      getPipelineUpGasPlace: "",
      getRepotTypeOptions: "", //获取当前选择的报表类型
      reportTypeChannge:'',
      planDataChange:[]
    };
  },
  computed: {
    curComCode: function () {
        return this.$store.getters.curCom
      },
      curComCodeName: function () {
      return this.$store.getters.curComName
    }
  },
  watch: {
    curComCode: {
        immediate: true,
        handler: function (n, o) {
          if(n && o) {
            this.getData();
          }
        }
      }

  },
  created() {
    this.getPlanList();
    // 获取昨日日期
    // this.dealTime('3')
    this.planForm.date = Date.now();
    this.gasReportDate[0] = new Date().setMonth((new Date().getMonth()-1));
    this.gasReportDate[1] = Date.now();
    this.comOptions = this.$store.getters["companyList"];
    // this.curComCode = this.$store.getters["curCom"];
    if (this.planForm.changeOptions) {
      this.geulistComps();
    }
  },
 
  async mounted() {
    this.listSupplier();
    this.getPlanList();
    this.tipPriceE();
  },
  beforeDestroy() {
    // window.removeEventListener('resize');
  },
  methods: {
    // 根据字符长度动态计划文本框宽度
    labelWidth: function(value='') {
      return value.length >= 6 ? '200px' : '130px'
    },    
    closeSupper(){
      this.listSupplier();
      this.dialogFormVisible = false
    },
    insertyty(val){
     console.log(val)
    },
     dealTime(v){ 
          let b = 24*60*60*1000   //一天的时间
          let day = new Date();  //当天的时间
          
          v == 3 ? day.setTime(day.getTime()-b) : v == 6 ? 
          day.setTime(day.getTime()) : day.setTime(day.getTime() + b);
          
          let dayMon=(day.getMonth() + 1) >= 10 ? day.getMonth()+1 : '0' + (day.getMonth() + 1)
          let dayDat=(day.getDate() + 1) >= 10 ? day.getDate() : '0' + (day.getDate())
          
          let s = day.getFullYear() + "-" + dayMon + "-" + dayDat;
          this.planForm.date = s
    },
      pipTipContentShowB(val,index){
        this.getPipelinesList[index].pipTipContentShow=true
      //  this.pipTipContentShow = true
      },
      pipTipContentHideB(val,index){
          this.pipTipContentShow = false
          this.getPipelinesList[index].pipTipContentShow=false
      },
    getData(){
      this.listSupplier();
      this.getPlanList();
      this.tipPriceE();
    },
    tipContentShowB(){
       this.tipContentShow=true
    },
    tipContentHideB(){
    this.tipContentShow = false
    },
    addPriceTimePhasUser(){
    
      let asd = {
        code: this.getuserchangeData.code,
        codeTxt: this.getuserchangeData.name,
        gasPrice: "",
        id:'' ,
        priceDesc: [
          {
            num: "",
            price: "",
          },{
            num: "超量",
            price: "",
          }

        ],
        shoArr:[],
        priceType: "1",
        status: "",
        time: null,
        timeSlot: "",
        year: ""
      }
      this.getlistCompPriceData.push(asd)
      this.getlistCompPriceData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          if(!item.shoArr){
            this.$set(item, "shoArr", []);
          }
          // this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            // item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          // (item.startDate = item.timeSlot.split("-")[0]),
          //   (item.endTime = item.timeSlot.split("-")[1]);
          // item.shoArr = item.timeSlot.split("-");
        });
    },
    addPriceTimePhas(){
      let asd = {
        code: this.getGPriceItem.code,
        codeTxt: this.getGPriceItem.name,
        gasPrice: "",
        id:'' ,
        priceDesc: [
          {
            num: "",
            price: "",
          },{
            num: "超量",
            price: "",
          }

        ],
        shoArr:['',''],
        priceType: "1",
        status: "",
        time: null,
        timeSlot: "",
        year: ""
      }
      this.getGPriceItemData.push(asd)
      this.getGPriceItemData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          if(!item.shoArr){
            this.$set(item, "shoArr", []);
          }
          if (item.priceDesc) {
            // item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          // (item.startDate = item.timeSlot.split("-")[0]),
          //   (item.endTime = item.timeSlot.split("-")[1]);
          // item.shoArr = item.timeSlot.split("-");
        });
    },
   
    exportExcel1() {
      // this.gasPrepaidReport()  
      if (this.getRepotTypeOptions == "01") {
        this.gasPrepaidReport();
      } else if (this.getRepotTypeOptions == "02") {
        this.gasPriceRportExport();
      } else if (this.getRepotTypeOptions == "03") {
        this.gasDayReport();
      }
    },
    // 价格日报表导出
    gasPriceRportExport() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        lifnr: this.gasPriceRportchange[0],
      };
      api.dayGasD.gasPriceRportExport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 费用日报表导出
    gasPrepaidReport() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        supplierCode: this.gasPriceRportchange[0],
      };
      api.dayGasD.gasPrepaidReport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 气量报表导出
    gasDayReport() {
      let data = {
        endTime: this.getCusYear1(this.gasReportDate[1]),
        startTime: this.getCusYear1(this.gasReportDate[0]),
        code: this.gasPriceRportchange[0],
      };
      api.dayGasD.gasDayReport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    dialogVisibleConfirm(){
      let val =  this.setStatus
      let index = this.setStatusIndex
      // 判断要设置的是供应商还是用气客户或者管输方
      console.log(this.setType)
      if(this.setType == 'linfnr'){
        console.log('linfnr---------')
         this.LinfrsStatus(val,index)
      }else if(this.setType == 'user'){
        console.log('user=======')
        this.CompStatus(val,index)
      }else if(this.setType == 'pipe'){
        console.log('pipe=======')
         this.PipelineStatus(val,index)
      }
      
      this.dialogVisible = false
       
    },
    dialogConsole(){
        this.dialogVisible = false
       
    },
    // 调用设置供应商接口
    LinfrsStatus(val,index){
      if (val.status == "1") {
          console.log('zhuangtai----')
        this.getSuppliersList[index].status = "2";
      } else {
        console.log('lallal----')
        this.getSuppliersList[index].status = "1";
      }
      console.log(val)
      console.log(this.getSuppliersList[index].status)
      let data = {
        code: val.code,
        // status: 1,
        status: this.getSuppliersList[index].status,
      };
      api.dayGasD.saveLinfrsStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    //   保存供应商状态
    saveLinfrsStatus(val, index) {
      this.setStatus = ''
      this.setStatusIndex = ''
     
      this.setStatus = val
      this.setStatusIndex = index
      this.setTypeTip = ''
      
      // 1启用，2停用
      if(this.getSuppliersList[index].status == "1"){
        console.log('是否启用')
         this.setTypeTip = 'gysF'     
      }else if(this.getSuppliersList[index].status == "2"){
         this.setTypeTip = 'gysT'
      }
      // 判断是供应商还是用气客户
      this.setType = 'linfnr'
      this.dialogVisible = true
     
    },
    CompStatus(val,index){
      console.log(val)
       if (val.status == "1") {
        this.getCompVosList[index].status = "2";
      } else {
        this.getCompVosList[index].status = "1";
      }
      let data = {
        companycode: val.code,
        // companycode: "180032",
        status: this.getCompVosList[index].status,
      };
      api.dayGasD.saveCompStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    // 保存公司状态
    saveCompStatus(val, index) {
       this.setStatus = ''
      this.setStatusIndex = ''
     
      this.setStatus = val
      this.setStatusIndex = index
      this.setTypeTip = ''
      
      // 1启用，2停用
      if(this.getCompVosList[index].status == "1"){
        console.log('是否启用')
         this.setTypeTip = 'userF'     
      }else if(this.getCompVosList[index].status == "2"){
         this.setTypeTip = 'userT'
      }
      // 判断是供应商还是用气客户
      this.setType = 'user'
      this.dialogVisible = true
     
    },
    PipelineStatus(val,index){
       if (val.status == "1") {
        this.getPipelinesList[index].status = "2";
      } else {
        this.getPipelinesList[index].status = "1";
      }
      let data = {
        pipelineCode: val.code,
        status: this.getPipelinesList[index].status,
      };
      api.dayGasD.savePipelineStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    // 管输方状态保存
    savePipelineStatus(val, index) {
      this.setStatus = ''
      this.setStatusIndex = ''
      this.setStatus = val
      this.setStatusIndex = index
      this.setTypeTip = ''
      
      // 1启用，2停用
      if(this.getPipelinesList[index].status == "1"){
        console.log('是否启用')
         this.setTypeTip = 'pipeF'     
      }else if(this.getPipelinesList[index].status == "2"){
         this.setTypeTip = 'pipeT'
      }
      // 判断是供应商还是用气客户
      this.setType = 'pipe'
      this.dialogVisible = true
    },
    changePlanForm() {
      this.tipPriceE();
      if (this.planForm.changeOptions) {
        this.listSupplier();
      }
    },
    getFormatTime: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return yyyy + "-" + mm + "-" + dd;
    },
    getPlanList() {
      api.dayGasD.getEntys().then((res) => {
        if (res) {
          this.getEntysList = res;

          (this.getCompVosList =
            this.getEntysList.length > 0 ? this.getEntysList[0].companys : []), //A获取供应商数据
            (this.getSuppliersList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].suppliers
                : []), //获取用气客户数据
            (this.getPipelinesList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].pipelines
                : []) //获取管输方数据
                this.getPipelinesList.forEach(item=>{
                  this.$set(item,'pipTipContentShow',false)
                  // item.pipTipContentShow = false
                  // if(item.pipelineType==2){
                  //   item.pipTipContentShow = false
                  // }
                  
                  
                })
                console.log(this.getPipelinesList)
        }
        
      });
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
      //   this.getData()
    },
    // 获取日气量计划 选择的供应商
    handleChange(e) {
      // 已选择供应商数据
      if (e.length != 0) {
        this.getChangedSupplier = this.getArrEqual(this.listSupplierList, e);
      }
      this.geulistComps();
    },
    // 获取日气量报表 选择的供应商
    handleChange1(e) {
      //   获取日报表查询选择的供应商
      this.gasPriceRportchange = e;
      if (this.getRepotTypeOptions == "01") {
        this.gasPrepaidReportList();
      } else if (this.getRepotTypeOptions == "02") {
        this.gasPriceRportList();
      } else if (this.getRepotTypeOptions == "03") {
        this.gasReportList();
      }
    },
    // 获取已选供应商
    getArrEqual(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr1.length; i++) {
          if (arr1[i].linfnr === arr2[0]) {
            newArr.push(arr1[i]);
          }
      }
      return newArr;
    },
    // 供应商删除时间价格阶段
    delPriceB(item,index){
      this.getGPriceItemData.forEach((element,index1) => {
        if(index ==index1){
          this.getGPriceItemData.splice(index, 1);
        }
      });


    },
    delPriceUser(item,index){
      this.getlistCompPriceData.forEach((element,index1) => {
        if(index ==index1){
          this.getlistCompPriceData.splice(index, 1);
        }
      });


    },
    addBtnClickedgsf(val) {
      this.getGPriceItemData.forEach((item1) => {
        if (item1.id == val.id) {
          let asd = {
            num: "",
            price: "",
          };
          item1.priceDesc.splice(item1.priceDesc.length - 2, 0, asd);
          // item1.priceDesc.push(asd);
        }
      });
    },

    addBtnClickeduser(val) {
      this.getlistCompPriceData.forEach((item1) => {
        if (item1.id == val.id) {
          let asd = {
            num: "",
            price: "",
          };
          item1.priceDesc.splice(item1.priceDesc.length - 2, 0, asd);
        }
      });
    },
    // 删除阶梯
    delStep(dd) {
      this.getGPriceItemData.forEach((item) => {
        item.priceDesc.forEach((val, index) => {
          if (dd == index) {
            item.priceDesc.splice(index, 1);
          }
        });
      });
      
    },
    delStepUser(dd) {
      this.getlistCompPriceData.forEach((item) => {
        item.priceDesc.forEach((val, index) => {
          if (dd == index) {
            item.priceDesc.splice(index, 1);
          }
        });
      });
      
    },
    // 供应商tab栏
    handleClickGYS(tab) {
      if (tab.name == "first") {
        this.listLinrsPrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.supplierPriceList();
      }
    },
    // 用气客户tab栏
    handleClickkh(tab) {
      if (tab.name == "first") {
        this.getlistCompPrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.compPriceList();
      }
    },
    // 管输方tab栏
    handleClickGSF(tab) {
      if (tab.name == "first") {
        this.getlistPipelinePrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.pipelinePriceList();
      }
    },
    setPrice() {
      this.dialogFormVisible = true;
      this.getPlanList();
    },
    // 供应商设置弹框
    setGPrice(val) {
      this.getGPriceItem = val;
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = true;
      this.activeName= "first"
      this.listLinrsPrice();
      this.editTimer++;
    },
    // 管输方
    GSetGPrice(val) {
      this.getGSFitem = val;
      this.dialogFormVisible = false;
      this.dialogFormVisible3 = true;
      if(val.pipelineType === 2){
          this.pipIsShow = false
      }else{
          this.pipIsShow = true
      }
      this.activeNameGSF = 'first'
      this.getlistPipelinePrice(val);
    },
    // 用气客户设置
    userSetGPrice(val) {
      this.getuserchangeData = val;
      this.usergetPprice = val;
      this.activeNameUser = 'first'
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = true;
      this.getlistCompPrice(val);
      this.editTimerUser++
    },
    ReportListdateChange(val) {
      // (Date.now() - new Date(date).getTime() > 0 && Date.now() - new Date(date).getTime() < 31*24*3600000)
      
      // if(new Date(val[1]).getTime()- new Date(val[0]).getTime() >10*24*3600000){
      //   this.gasReportDate = []
      //    alert('选择日期长度不不能大于十')
      // }
      if (this.getRepotTypeOptions == "01") {
        this.gasPrepaidReportList();
      } else if (this.getRepotTypeOptions == "02") {
        this.gasPriceRportList();
      } else if (this.getRepotTypeOptions == "03") {
        this.gasReportList();
      }
    },

    // 用气量计划部分

    // 获取日气量计划供应商
    listSupplier() {
      console.log('获取供应商')
      this.listSupplierList = []
      let data = {
        xaReig: this.$store.getters["curCom"],
        endTime: this.getCusYear1(this.planForm.date),
        startTime: this.getCusYear1(this.planForm.date),
      };
      api.dayGasD.listSupplier(data).then((res) => {
        this.listSupplierList = res;     
        let changeS = []
        changeS.push(this.listSupplierList[0].linfnr) 
        this.planForm.changeOptions = changeS
        this.reportChangeOptions = changeS  
        this.gasPriceRportchange = changeS
        this.getChangedSupplier = this.planForm.changeOptions
        // 供应商默认选择第一个，报表类型默认设置气量报表
        this.geulistComps('01',changeS)
        this.handleChange(changeS)
        // this.gasReportList()
        this.reportTypeChannge = ['03']
        this.getRepotTypeOptions =['03']
        this.reportTypeM = '03'
      });
    },
    // 日期格式转换
    getCusYear(strDate) {
      if (strDate && strDate.length === 0) return "";
      let date = new Date(strDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1 + "";
      let d = date.getDate() + "";
      return (
        y +
        "/" +
        (m.length === 1 ? "0" + m : m) +
        "/" +
        (d.length === 1 ? "0" + d : d)
      );
    },
    getCusYear1(strDate) {
      if (strDate && strDate.length === 0) return "";
      let date = new Date(strDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1 + "";
      let d = date.getDate() + "";
      return (
        y +
        "-" +
        (m.length === 1 ? "0" + m : m) +
        "-" +
        (d.length === 1 ? "0" + d : d)
      );
    },
    // 获取燃气客户、供应商用气量
    geulistComps(val,item) {
      console.log('获取燃气客户')
      let filterCom
      if(val=='01'){
        filterCom = item
      }else{
         filterCom = this.getChangedSupplier.map((val) => {
        return val.linfnr || val.lifnr;
      });
      }
      let data = {
        // codes: ["180032"],
        codes: filterCom,
        endTime: this.getCusYear(this.planForm.date),
        startTime: this.getCusYear(this.planForm.date),
      };
      // if (filterCom.length > 0) {
        api.dayGasD.listCompsChangeHistory(data).then((res) => {
          let getplanUserdata = [];
          let getData = res ? res[0].lifnr : [];
          let getChangedSupplierData = res[0].lifnr;
          getData.forEach((item) => {
            getplanUserdata = [...getplanUserdata, ...item.comp];
          });

          this.getChangedSupplier = getChangedSupplierData;
          this.planUserdata = getplanUserdata;
          let planUser = []
          // this.planUserdata.forEach(item=>{
          //    item.planUser = item.compCode
          // })
        let tempArr = [];
        let Data = [];
          for (let i = 0; i < this.planUserdata.length; i++) {
              if (tempArr.indexOf(this.planUserdata[i].code) === -1) {
              Data.push({
              compCodeTxt: this.planUserdata[i].codeTxt,
              code:this.planUserdata[i].code,
              dataInfo: [this.planUserdata[i]]
              });
              tempArr.push(this.planUserdata[i].code);
              } else {
                  for (let j = 0; j < Data.length; j++) {
                      if (Data[j].code == this.planUserdata[i].code) {
                      Data[j].dataInfo.push(this.planUserdata[i]);
                      break;
                      }
                  }
              }
          }
          this.planDataChange = Data
        }).catch((err) => {
          console.log('enter the catch,empty data2222222222222')
          this.$nextTick(() => {
            this.planDataChange = []

          })
        });
      // }
    },
    // 提交用气量
    planCommit() {
      let Supplier = this.deepClone(this.getChangedSupplier);
      let SupplierLastArray = [];
      Supplier.forEach((item) => {
        let obj = {};
        obj.id = item.planId;
        obj.gasNum = item.gasNum;
        obj.code = item.lifnr;
        obj.codeTxt = item.lifnrTxt;
        obj.time = this.getCusYear1(this.planForm.date);
        obj.type = "0";
        obj.changeGasNum = item.changeGasNum;
        obj.msg = item.msg;
        SupplierLastArray.push(obj);
      });
      let userDatachange = [];
      this.planDataChange.forEach((item) => {
          item.dataInfo.forEach(item1=>{
              let obj = {};
                obj.id = item1.id;
                obj.gasNum = item1.gasNum;
                obj.code = item1.code;
                obj.codeTxt = item1.codeTxt;
                // obj.status =  item1.status;
                obj.status =  0;
                // obj.compCode = item1.compCode
                // obj.compCodeTxt = item1.compCodeTxt
                obj.downGasPlace = item1.downGasPlace;
                obj.lifnr = item1.lifnr
                obj.time = this.getCusYear1(this.planForm.date);
                obj.type = "1";
                obj.changeGasNum = item1.changeGasNum;
                obj.msg = item1.msg;                
                userDatachange.push(obj); 
          }) 
      });
    //    this.planDataChange.forEach((item) => {
    //     let obj = {};
    //     obj.id = item.id;
    //     obj.gasNum = item.gasNum;
    //     obj.code = item.compCode;
    //     obj.codeTxt = item.compCodeTxt;
    //     obj.time = this.getCusYear1(this.planForm.date);
    //     obj.type = "1";
    //     userDatachange.push(obj);
    //   });
      let contentArr = [...userDatachange, ...SupplierLastArray];
      // console.log('contentArr111111111111111111111：',contentArr)
      // return
      // 判断用户是否输入了变更气量
      let cnt = 0
      this.planUserdata.map(item => {
        if(item.changeGasNum !== '' && item.changeGasNum !== null && Number(item.changeGasNum) >= 0 ) {
          cnt++
        }
      })
      if(cnt === 0) {
        this.$message({
          message:'未添加变量更气量，提交失败',
          type:'error',
          duration:3000
        })
        return
      }
      // return
      if (this.planUserdata.length < 1 && this.getChangedSupplier.length < 1) {
        return;
      } else if (this.planUserdata.length < 1) {
        this.$message({
          message: "无用气客户，提交失败",
          type: "error",
          duration: 1000,
        });
      } else if (this.getChangedSupplier.length < 1) {
        this.$message({
          message: "无供应商数据，提交失败",
          type: "error",
          duration: 1000,
        });
      }
      if (this.getChangedSupplier.length > 0 && this.planUserdata.length > 0) {
        api.dayGasD.savegasJournalPlanChangeHistory(contentArr).then((res) => {
          if (res) {
            this.$message({
              message: "提交成功",
              type: "success",
              duration: 1000,
            });
            this.geulistComps();
          }
        });
      }
    },
    // 重置日气量
    resetBtn() {
      this.getChangedSupplier.forEach((item) => {
        // item.gasNum = "";
        item.changeGasNum = "";
        item.msg = "";
      });
      this.planUserdata.forEach((item) => {
        // item.gasNum = "";
        item.changeGasNum = "";
        item.msg = "";
      });
    },
    //   气量日报表部分
    changeRepotTypeOptions(getType) {
      // 01费用日报表
      // 02价格日报表
      // 03气量日报表
      this.reportTypeM = getType[0]
      this.getRepotTypeOptions = getType[0];

      if (getType[0] == "01") {
        this.gasPrepaidReportList();
      } else if (getType[0] == "02") {
        this.gasPriceRportList();
      } else if (getType[0] == "03") {
        this.gasReportList();
      }
    },
    // 获取费用日报表接口
    gasPriceRportList() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        lifnr: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasPriceRportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        this.getPriceReportData.dataList.forEach(item =>{
          if(item.date =='合计'){
              return
          }else{
               item.date = item.date?this.getCusYear(item.date):''
          }       
        })
      });
    },
    // 日气量报表
    gasReportList() {
      let data = {
        endTime: this.getCusYear1(this.gasReportDate[1]),
        startTime: this.getCusYear1(this.gasReportDate[0]),
        code: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasReportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        this.getPriceReportData.dataList.forEach(item =>{
          if(item.date =='合计'){
              return
          }else{
               item.date = item.date?this.getCusYear(item.date):''
          }       
        })
      });
    },
    // 获取费用日报表
    gasPrepaidReportList() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        supplierCode: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasPrepaidReportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        // if( this.getPriceReportData.length>0){
           this.getPriceReportData.dataList.forEach(item =>{
          if(item.date =='合计'){
              return
          }else{
               item.date = item.date?this.getCusYear(item.date):''
          }       
        })
        // }
      });
    },
    // 价格设置相关

  
    // 供应商价格设置
    nextBtnClicked() {
      this.saveLifnrsPrice();
    },
    // 获取供应商价格
    listLinrsPrice() {
      let data = {
        lifnr: this.getGPriceItem.code,
      };
      api.dayGasD.listLinrsPrice(data).then((res) => {
        this.getGPriceItemData = res;
        this.getGPriceItemData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
      });
    },
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    // 保存设置价格供应商价格设置
    saveLifnrsPrice() {
      let deepData = this.deepClone(this.getGPriceItemData);
      let flag = 0
      deepData.forEach((item) => {
        let dateC = [];
        dateC[0] = this.getCusYear(item.shoArr[0]);
        dateC[1] = this.getCusYear(item.shoArr[1]);
        item.timeSlot = dateC.join("-");
        item.shoArr = JSON.stringify(item.shoArr);
        delete item.shoArr;
        delete item.endTime;
        delete item.startDate;
        item.priceDesc.forEach((item1) => {
          if (item1.num === "超量") {
            item1.num === "max";
          }
          if(item.priceType ==2 && !item1.price){
            flag = 1
          }
        });
        
        item.priceDesc = JSON.stringify(item.priceDesc);
      });
     if(!flag){
          api.dayGasD.saveLifnrsPrice(deepData).then((res) => {
            if (res) {
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 1000,
              });
              setTimeout(() => {
                (this.dialogFormVisible = true), //设置价格弹框显示
                  (this.dialogFormVisible1 = false); //供应商弹框显示
              }, 1000);
            }
          });
     }else{
       this.$message({
            message: "请填写阶梯单价",
            type: "error",
            duration: 1000,
          });
     }
    },
    // 获取管输方价格
    getlistPipelinePrice() {
      let data = {
        pipeLineCode: this.getGSFitem.code,
      };
      api.dayGasD.getlistPipelinePrice(data).then((res) => {
        this.getlistPipelinePriceData = res;
        this.getlistPipelinePriceData.map((item) => {
          return item.upGasPlace;
        });
        this.getPipelineUpGasPlace = res?res[0].upGasPlace:''
      });
    },
    // 管输方价格设置
    savePipelinePrice() {
      api.dayGasD
        .savePipelinePrice(this.getlistPipelinePriceData)
        .then((res) => {
          if (res) {
            this.$message({
              message: "设置成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
                (this.dialogFormVisible3 = false); //供应商弹框显示
            }, 1000);
          }
        });
    },
    // 管输方价格设置返回
    gsfBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible3 = false); //供应商弹框显示
    },
    // 用气客户价格设置返回
    userBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible2 = false); //供应商弹框显示
    },
    gysBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible1 = false); //供应商弹框显示
    },
    // 获取公司价格
    getlistCompPrice() {
      let data = {
        companyCode: this.usergetPprice.code,
      };
      api.dayGasD.getlistCompPrice(data).then((res) => {
        this.getlistCompPriceData = res;
        this.getlistCompPriceData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
      });
    },
    // 保存公司价格
    saveCompPrice() {
      let flag = 0
      let data = this.deepClone(this.getlistCompPriceData);
      data.forEach((item) => {
        let asd = [];
        asd[0] = this.getCusYear(item.shoArr[0]);
        asd[1] = this.getCusYear(item.shoArr[1]);
        item.timeSlot = asd.join("-");
        item.shoArr = JSON.stringify(item.shoArr);
        delete item.shoArr;
        delete item.endTime;
        delete item.startDate;
        
        item.priceDesc.forEach((item1) => {
          if (item1.num === "超量") {
            item1.num === "max";
          }
          if(item.priceType ==2 && !item1.price){
            flag = 1
          }
        });

        item.priceDesc = JSON.stringify(item.priceDesc);
      });
      console.log(flag)
     if(!flag){
         api.dayGasD.saveCompPrice(data).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible2 = false); //供应商弹框显示
          }, 1000);
        }
      });
     }else{
       this.$message({
            message: "请填写阶梯单价",
            type: "error",
            duration: 1000,
          });
     }
     
    },
    // 公司价格设置返回
    comBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible2 = false); //供应商弹框显示
    },
    exportExcel: function () {
      let params = {
        cpmoCop: this.curComCode,
        startTime: this.startTime.toString(),
        endTime: this.endTime.toString(),
      };
      api.reply.export(params).then((res) => {
        this.download(res.data, "xls", "export");
      });
    },
    // 公司价格导出
    compsExportPrice() {
      let data = {
        companyCode: this.usergetPprice.code,
      };
      api.dayGasD.compsExportPrice(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 供应商价格导出
    lifnrsExport() {
      let data = {
        lifnr: this.getGPriceItem.code,
      };
      api.dayGasD.lifnrsExport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 供应商预付费用保存
    setSupplierPricey() {
      let parames = {
        balancePrice: 0,
        code: this.getGPriceItem.code,
        codeTxt: "",
        gasPrice: "",
        id: 0,
        prepaidPrice: this.setSupplierPriceyD.prepaidPrice,
        priceDesc: "",
        priceType: "",
        status: "",
        time: this.getFormatTime(this.setSupplierPriceyD.time),
        timeSlot: "",
        year: "",
      };
      if(this.setSupplierPriceyD.prepaidPrice){
        api.dayGasD.setSupplierPricey(parames).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
                (this.dialogFormVisible1 = false); //供应商弹框显示
            }, 1000);
          }
        });
       }else{
        this.$message({
              message: "请输入预付费用",
              type: "error",
              duration: 1000,
            });
      }
    },
    setCompPriceY() {
      let parames = {
        balancePrice: 0,
        code: this.getuserchangeData.code,
        codeTxt: "",
        gasPrice: "",
        id: 0,
        prepaidPrice: this.setCompPriceYD.prepaidPrice,
        priceDesc: "",
        priceType: "",
        status: "",
        time: this.getFormatTime(this.setCompPriceYD.time),
        timeSlot: "",
        year: "",
      };
      if(this.setCompPriceYD.prepaidPrice){
      api.dayGasD.setCompPriceY(parames).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false); //供应商弹框显示
          }, 1000);
        }
      });
      }else{
        this.$message({
              message: "请输入预付费用",
              type: "error",
              duration: 1000,
            });
      }
    },
   
    //  管输预付费用保存
    setPipelinePriceY() {
      let parames = {
        balancePrice: 0,
        id: 0,
        pipelineCode: this.getGSFitem.code,
        prepaidPrice: this.setPipelinePriceYD.prepaidPrice,
        time: this.getFormatTime(this.setPipelinePriceYD.time),
      };
      if(this.setPipelinePriceYD.prepaidPrice){
         api.dayGasD.setPipelinePriceY(parames).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
                (this.dialogFormVisible3 = false); //供应商弹框显示
            }, 1000);
          }
        });
      }else{
        this.$message({
              message: "请输入预付费用",
              type: "error",
              duration: 1000,
            });
      }
      
    },
    tipPriceE() {
      let data = {
        time: this.getCusYear1(this.planForm.date),
      };
      api.dayGasD.tipPriceE(data).then((res) => {
        this.tipPriceData = res?res:[];
      });
    },
    // 供应商预付费用列表
    supplierPriceList(val) {
      this.setSupplierPriceyD.prepaidPrice = ''
      let getDate = val?val:this.planForm.date
      let data = {
        code: this.getGPriceItem.code,
        time: this.getCusYear1(getDate),
      };
      api.dayGasD.getPrepaidPriceData(data).then((res) => {
          this.setSupplierPriceyD.prepaidPrice = res[0].prepaidPrice?res[0].prepaidPrice:''
          this.setSupplierPriceyD.time = res[0].time?res[0].time:'';
      });
    },
    // 公司预付费用列表
    compPriceList(val) {
      this.setCompPriceYD.prepaidPrice = ''
      let getDate = val?val:this.planForm.date
      let data = {
        code: this.getuserchangeData.code,
        time: this.getCusYear1(getDate)
      }
      api.dayGasD.getCompPrepaidPrice(data).then((res) => {
        // this.compPriceListData = res[0].list[0];
        this.setCompPriceYD.prepaidPrice = res[0].prepaidPrice?res[0].prepaidPrice:'';
        this.setCompPriceYD.time = res[0].time?res[0].time:'';
      });
    },
    // 供应商
    changeCompForm(val){
     this.supplierPriceList(val)
    },
    // 用气客户
    changeUserForm(val){
       this.compPriceList(val)
    },
    // 管输方
    changePipelineForm(val){
        this.pipelinePriceList(val)
    },
    // 管输预付费用列表
    pipelinePriceList(val) {
      this.setPipelinePriceYD.prepaidPrice = ''
      let getDate = val?val:this.planForm.date
      let data = {
        code: this.getGSFitem.code,
        time: this.getCusYear1(getDate),
      };
       api.dayGasD.getPipelinePriceData(data).then((res) => {
          this.setPipelinePriceYD.prepaidPrice = res[0].prepaidPrice?res[0].prepaidPrice:''
          this.setPipelinePriceYD.time = res[0].time?res[0].time:''
      });
    },
  },
};
</script>
<style lang='scss'>
.day-gas-container {
    background-size: 100% 450px;
  .el-date-editor .el-range-separator{
    width: 0%;
  }
  .date-picker-change{
     .el-input__inner{
        width: 90%!important;
     }
  }
  .price-custom{
     .el-input__inner{
        width: 90%!important;
     }
     .custom-unit {
          position: absolute;
          top: 0;
          right: 105px;
          color: #74788d;
        }
  }
  .date-picker .el-range-separator {
    color: #443939;
}
.date-picker .el-range-input{
  width: 100px;
}
  .submitBtn-day {
    background: #e5f6f6;
    border-radius: 20px;
    border: none;
    color: #0fb2ab;
  }
  .el-table--border,
  .el-table--group {
    border: none;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }

}
</style>
<style lang='scss' scoped>
.day-gas-mask{
    height: 100%;
}
.day-gas-container {
  .supplier-list{
    /deep/.el-form-item{
      position: relative;
      .el-input__inner{
        border: none;
        border-radius: 18px;
        padding: 0 20px;
      }
    }
    /deep/.el-form-item__label{
      padding-left:18px;
    }
  }  
  /deep/.el-input__inner {
    border-radius: 18px;
    background: #f6f7fa;
    width: 100%;
  }

  /deep/.el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    font-size: 24px;
    .el-dialog__headerbtn {
      font-size: 23px;
    }
  }
  .tip-dialog{
    /deep/.el-dialog__header{
      border: none;
    }
    /deep/.el-dialog__body{
      padding: 26px;
    }
  }
  
  /deep/.el-tabs__content {
    .el-radio-group {
      width: 100%;
      display: flex !important;
      // margin-left: 10px;
    }
    .el-radio {
      color: #606266;
      cursor: pointer;
      // margin: 0 15px;
      // border: 1px solid #0FB2AB;
      background: #f6f7fa;
      padding: 13px 30px;
      border-radius: 30px;
      width: 28%;
    }
    .is-checked.el-radio {
      color: #606266;
      cursor: pointer;
      // margin: 0 15px;
      border: 1px solid #0fb2ab;
      padding: 13px 30px;
      border-radius: 30px;
      background: #ffffff;
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #0fb2ab;
        background: #0fb2ab;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: #0fb2ab;
      }
    }
  }
  
  .set-price {
    padding: 30px;
    .title {
      margin: 20px;
    }
    .list-com {
      display: flex;
      padding: 10px;
      flex-wrap: wrap;

      .supplier-input {
        width: 50%;
        .el-input__inner {
          padding: 0 25px;
          color: red;
          background: red !important;
        }
      }
    }
    .price-list {
      .list-itemC {
        border: 1px solid #0fb2ab;
      }
      .pipe-tooltip{
          position: relative;
          .tooltip {
                display: none;
                position: absolute;
                top: 7px;
                right: -199px;
                width: 276px;
                height: 60px;
                line-height: 28px;
                /* padding: 0 10px; */
                background: #f6f7fa;
                border-radius: 9px;
                color: #999999;
                text-align: center;
                .popper__arrow {
                  position: absolute;
                  left: -11px;
                  top: 12px;
                  display: block;
                  width: 0;
                  height: 0;
                  border-color: transparent;
                  border-style: solid;
                  border-width: 6px;
                  border-right-color: #e5f6f6;
                }
                
              }
              .tip-content-show{
                 display: block;
              }  
      }
      .list-item {
        min-width: 32%;
        color: pink;
        border-radius: 100px;
        background: #f6f7fa;
        // border: 1px solid #0fb2ab;
        line-height: 44px;
        display: flex;
        justify-content: space-between;
        height: 44px;
        margin-right: 10px;
        margin-bottom: 20px;
        .el-icon-error {
          color: #4f4c4c;
        }
        .uncheced {
          margin: -2px 22px;
        }
        /* border: 1px solid; */
        // box-shadow: 0px 10px 20px rgb(38 51 88 /W 7%);
        &:hover {
          opacity: 1;
          background: #ffffff;
          .set-btn {
            opacity: 1;
          }
        }

        i {
          padding: 0 20px;
          color: #0fb2ab;
        }
        label {
          color: #505356;
          // background: #EDEEF4;
          // padding: 10px 15px;
          // border-radius: 19px;
        }
        .set-btn {
          opacity: 0;
          padding: 0 13px;
          line-height: 24px;
          height: 24px;
          vertical-align: middle;
          display: inline-block;
          /* margin-top: 4px; */
          color: #0fb2ab;
          margin-right: 10px;
          background: #ffffff;
          border: 1px solid #0fb2ab40;
          // opacity: 0.3;
          border-radius: 16px;
          align-self: center;
        }
        .virtual{
           background: #0FB2AB;
            color: #ffffff;
            border-radius: 20px;
            padding: 6px 10px;
            margin-left: 5px;
            .el-icon-question{
                padding: 2px;
                color: #0fb2ab;
                width: 10px;
                height: 10px;
                color: #fff;
            }
        }
      }
    }
  }
  .set-detail {
    width: 80%;
    margin: 0 auto;
    .detail-title {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      .title-left {
        .com-name {
          margin-right: 20px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 600;
          line-height: 33px;
          color: #2c3e50;
          opacity: 1;
        }
        .com-code {
          padding: 1px 10px;
          border-radius: 20px;
          background: #f6f7fa;
          color: #74788d;
          display: inline-block;
          vertical-align: middle;
           margin-bottom: 10px;
        }
      }
      .submitBtn {
        color: #0fb2ab;
        background: #fff;
        border: 1px solid #0fb2ab;
        border-radius: 100px;
      }
    }
    .detail-content {
      .addprice-btn{
            width: 119px;
            background: #0fb2ab;
            color: #ffffff;
            padding: 11px 20px;
            border-radius: 30px;
            margin-top: 20px;
            text-align: center;
          }
      .custom-tab {
        .custom-label {
          position: absolute;
          top: 0;
          left: 12px;
          color: #74788d;
        }
        .custom-unit {
          position: absolute;
          top: 0;
          right: 18px;
          color: #74788d;
        }
         .price-custom{
     .custom-unit {
          position: absolute;
          top: 0;
          right: 105px;
          color: #74788d;
        }
  }

        .step-input {
          /deep/.el-input {
            .el-input__inner {
              padding: 0 43px;
            }
          }
        }

        /deep/.date-picker {
          .el-range-input {
            background: none;
          }
        }
        /deep/.el-tabs__nav {
          .el-tabs__item {
            margin-bottom: 20px;
            height: 20px;
            line-height: 20px;
          }
          .el-tabs__item.is-active {
            color: #0fb2ab;
          }
          .el-tabs__active-bar {
            background: #0fb2ab;
            width: 88px !important;
            left: -13px;
          }
          #tab-first {
            border-right: 1px solid #e4e4e4;
            padding-left: 16px;
          }
        }
      }
      .del-step {
        padding: 3px 8px;
        vertical-align: top;
        display: inline-block;
        /* line-height: 36px; */
        border-radius: 20px;
        border: 1px solid;
        margin-top: 8px;
        margin-left: 10px;
      }
      .tab-content {
        padding: 20px 0px;
        
        .addprice-btn{
            width: 119px;
            background: #0fb2ab;
            color: #ffffff;
            padding: 11px 20px;
            border-radius: 30px;
            margin-left: 32px;
          }
        .content-item {
          padding: 40px 2px;
          
        }
        .del-price-btn{
          background: #0fb2ab;
          text-align: center;
          width: 12%;
          border-radius: 20px;
          padding: 10px;
          color: #ffffff;
          margin: 29px 35px;

        }
        .add-step {
          background: #fff;
          border-radius: 20px;
          color: #0fb2ab;
          margin: 15px 50px 50px;
        }
        .com-btn {
          display: flex;
          justify-content: space-between;
          padding: 50px 10px;
          .el-button {
            width: 114px;
            height: 46px;
            background: #ffffff;
            border: 1px solid #d2d2dc;
            opacity: 1;
            border-radius: 100px;
            font-family: PingFang SC;
            font-weight: 500;
            i {
              margin-right: 5px;
            }
          }
          .save-btn {
            background: #0fb2ab;
            opacity: 1;
            border-radius: 100px;
            border: none;
          }
        }
        .el-input {
          width: 100%;
        }
      }
    }
    .loser-detail {
      .loser-top {
        padding: 20px 10px;
        display: inline-block;
      }
      .loser-list {
        .list-top {
          display: flex;
          padding: 20px;
          .list-top-com {
            flex: 1;
            .custom-tooltip {
              position: relative;
              display: inline-block;
              color: #0fb2ab;
              .tooltip {
                opacity: 1;
                position: absolute;
                top: 7px;
                left: 21px;
                width: 64px;
                height: 28px;
                line-height: 28px;
                /* padding: 0 10px; */
                background: #e5f6f6;
                border-radius: 9px;
                color: #0fb2ab;
                text-align: center;
                .popper__arrow {
                  position: absolute;
                  left: -11px;
                  top: 12px;
                  display: block;
                  width: 0;
                  height: 0;
                  border-color: transparent;
                  border-style: solid;
                  border-width: 6px;
                  border-right-color: #e5f6f6;
                }
              }
            }
          }
          .list-top-com:hover .tooltip {
            opacity: 1;
          }
        }
      }
    }
  }
  .top-bag {
    // background: linear-gradient(180deg, #2146a1 0%, #d7dbe10a 100%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-bottom: 3px;
    .top-header {
      padding: 1px;
    }
    .top-title {
      padding-top: 20px;
      .top-con {
        // width: 80%;
        background: linear-gradient(
        180deg
        ,#3497D4 10%, #33c8ff9e 30%);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            padding-bottom: 3px;
            border-radius: 10px;
            padding: 23px;
            margin: 30px;
            margin-bottom: 0;
        .title {
          line-height: 35px;
          font-weight: 500;
          color: #ffffff;
          font-size: 24px;
          letter-spacing: 2px;
          img{
            vertical-align: middle;
          }
         
        }
        .plan-search-label{
          color: #ffffff;
          margin-right: 12px;
        }
        .gas-content {
          border-radius: 6px;
          background: #ffffff;
          padding: 30px 10px;
          margin: 0 auto;
          margin-top: 16px;
          position: relative;
                .user-header-title {
                  display: flex;
                  width: 100%;
                  color:#2C3E50;
                  font-size:16px;
                  font-weight:bolder;
                  margin-bottom:10px;
                }          
          .plan-list-title{
            margin-left: 30px;
            font-size: 16px;
            font-weight: 700;
          }
          .list-com {
            display: flex;
            padding: 10px;
            flex-wrap: wrap;
            .list-item {
              // flex: 1;
              width: 30%;
              margin-right: 20px;

              /deep/ label {
                background: #edeef4;
                background: #edeef4;
                border-radius: 100px;
                text-align: center;
              }
              .supplier-input {
                width: 50%;
                position: relative;
                .el-input__inner {
                  padding: 0 25px;
                  color: red;
                  background: red !important;
                }
              }
              .custom-unit {
                position: absolute;
                top: 0;
                right: 18px;
                color: #74788d;
              }
            }
            /* ---  供应商 水平布局 -----*/
            &.supplier-list {
                /* padding:12px 28px; */
                /* box-sizing: border-box; */
                .user-con{
                    width: 360px;
                    /deep/.el-form-item__content{
                      line-height: 42px;
                    }
                }              
                .list-item{
                      display: flex;
                      width: 100%;
                }
                .custom-tooltip {
                  position: relative;
                  display: inline-block;
                  color: #0fb2ab;
                  position: absolute;
                  right: 134px;
                  .tooltip {
                  opacity: 1;
                    position: absolute;
                    top: 7px;
                    left: 21px;
                    width: 64px;
                    height: 28px;
                    line-height: 28px;
                    background: #e5f6f6;
                    border-radius: 9px;
                    color: #0fb2ab;
                    text-align: center;
                    .popper__arrow {
                      position: absolute;
                      left: -11px;
                      top: 12px;
                      display: block;
                      width: 0;
                      height: 0;
                      border-color: transparent;
                      border-style: solid;
                      border-width: 6px;
                      border-right-color: #e5f6f6;
                    }
                  }
                }                
            }
            &.user-list {
                padding:12px 28px;
                .list-item{
                   /deep/label{
                     background: #f6f7fa;
                     margin-top: 2px;
                      height: 40px;
                      border-radius: 100px 0 0 100px;
                   }
                }
                .user-header-title {
                  display: flex;
                  width: 100%;
                  color:#2C3E50;
                  font-size:16px;
                  font-weight:bolder;
                  margin-bottom:10px;
                }
                .user-title{
                    /* width: 130px; */
                    line-height: 25px;
                    height: 25px;
                    border-radius: 30px;
                    padding: 8px 0px;
                    text-align:center;
                    /* box-sizing:border-box; */
                    background: #EDEEF4;
                }
                .user-con{
                    width: 360px;
                    /deep/.el-form-item__content{
                      line-height: 42px;
                    }
                }
                .user-con-change-reason {
                  width: 500px;
                }
                .custom-tooltip {
                  position: relative;
                  display: inline-block;
                  color: #0fb2ab;
                  position: absolute;
                  right: 134px;
                  .tooltip {
                  opacity: 1;
                    position: absolute;
                    top: 7px;
                    left: 21px;
                    width: 64px;
                    height: 28px;
                    line-height: 28px;
                    background: #e5f6f6;
                    border-radius: 9px;
                    color: #0fb2ab;
                    text-align: center;
                    .popper__arrow {
                      position: absolute;
                      left: -11px;
                      top: 12px;
                      display: block;
                      width: 0;
                      height: 0;
                      border-color: transparent;
                      border-style: solid;
                      border-width: 6px;
                      border-right-color: #e5f6f6;
                    }
                  }
                }
                .list-item{
                    display: flex;
                    width: 100%;
                    .insert-split{
                        position: absolute;
                        top: 1px;
                        left: 0px;
                        color: #D2D2DC;
                        width: 5px;
                        height: 20px;
                        display: inline-block;
                        z-index: 29;
                    }
                    .el-icon-location{
                          position: absolute;
                          top: 14px;
                          /* right: 10px; */
                          left: -130px;
                          color: #0FB2AB; 
                          width: 10px;
                          height: 10px;
                          z-index: 25;
                          font-size: 18px;
                    }
                }
            }
            
          }
          .price-tag {
            position: absolute;
            top: -25px;
            right: 10px;
            .setPrice {
              background: #0fb2ab;
              border-radius: 100px;
              color: #ffffff;
              padding: 13px 37px;
            }
            
             
            .tip-balance {
              display: inline-block;
              position: relative;
              // width: 50px;
              // height: 50px;
              border-radius: 100%;
              // background: red;
              line-height: 50px;
              text-align: center;
              color: #fff;
              margin-left: 15px;
              z-index: 999;
              img{
                vertical-align: middle;
                width: 60px;
                height: 60px;
              }
              .tip-number {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 17px;
                height: 17px;
                background: #d51313;
                border-radius: 50px;
                line-height: 19px;
                font-size: 14px;
                border: 3px solid blue;
              }

              .tip-content {
                width: 0;
                // opacity: 0;
                display: none;

                .solid-core {
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-bottom-color: red;
                  position: relative;
                  top: -22px;
                  left: 34%;
                }
                .hollow {
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-bottom-color: #fff1ea;
                  position: relative;
                  top: -40px;
                  left: 34%;
                  z-index: 2;
                }
                .tip-list {
                  padding: 18px 28px;
                  width: 380px;
                  position: absolute;
                  overflow: auto; 
                  max-height: 520px;
                  border: 2px solid red;
                  border-radius: 8px;
                  background: #fff1ea;
                  top: 58%;
                  right: -9px;
                  color: #ff523c;
                  text-align: left;
                  line-height: 35px;
                  padding-left: 50px;
                  z-index: 1;
                  .tip-icon {
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    // opacity: 0;
                  }
                  .tip-list-item {
                    line-height: 30px;
                    border-bottom: 1px solid #ff523c;
                    padding: 10px 0;
                    .supplier-title {
                      font-weight: 700;
                    }
                    .balance {
                      .balance-number {
                        font-weight: 700;
                      }
                    }
                  }
                  .tip-list-item:last-child {
                    border: none;
                  }
                }
              }
              .tip-content-show{
                 opacity: 1;
                 display: block;
                .tip-icon {
                  opacity: 1;

                }
              }
              .tip-balance-con{
                &:hover .tip-content {
                opacity: 1;
                .tip-icon {
                  opacity: 1;
                }
              }
              }
             
            }
          }
          .planSubmit {
            margin: 0px 30px;
            margin-bottom: 10px;
            .el-button {
              border-radius: 20px;
            }
            .submitBtn {
              background: #0fb2ab;
              padding: 15px 60px;
            }
            .resetBtn {
              background: #ffffff;
              color: #999;
              padding: 15px 30px;
            }
          }
        }
      }
    }
  }
  .tabel-container {
    padding: 27px;
    background: #fff;
    margin: 30px;
    border-radius: 10px;
    .table-search {
      padding: 10px;
      .derive-btn{
          text-align: right;
      }
      .day-table-date {
        //   /deep/.el-date-editor{

        //   }
        /deep/ .el-range-editor {
          width: 81%;

          .el-range-input {
            background: none;
          }
        }
      }
      .title {
        line-height: 45px;
        font-weight: 700;
        font-size: 24px;
      }
    }
    .table-unit {
      margin: 10px;
      color: #74788d;
      font-size: 18px;
    }
  }
}
// @import '~@/pages/purchaseAnalysis/style/index';
</style>
